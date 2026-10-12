import asyncio
import base64
import hmac
import json
import logging
import os
from contextlib import asynccontextmanager
from dataclasses import dataclass
from pathlib import Path
from typing import Optional

import numpy as np
import pandas as pd
from bson import Binary, ObjectId
from dotenv import load_dotenv
from fastapi import Depends, FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from geopy.distance import geodesic
from pymongo import MongoClient
from sklearn.neighbors import NearestNeighbors
from sklearn.preprocessing import OneHotEncoder, StandardScaler

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
log = logging.getLogger("recommender")

# ---------------------------------------------------------------- config
load_dotenv(Path(__file__).resolve().parents[1] / ".env")

MONGO_URI = os.environ.get("MONGO_URI")
if not MONGO_URI:
    raise RuntimeError("MONGO_URI must be configured in the environment")

REFRESH_SECONDS = int(os.environ.get("REFRESH_SECONDS", "900"))
API_KEY = os.environ.get("RECOMMENDER_API_KEY")  # shared secret with the Express server
ALLOWED_ORIGINS = [o.strip() for o in os.environ.get("ALLOWED_ORIGINS", "").split(",") if o.strip()]

client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=10000)
collection = client[os.environ.get("MONGO_DB_NAME", "test")]["houses"]

CATEGORICAL = ["propertyType", "status"]
NUMERICAL = ["size", "latitude", "longitude"]
# NOTE: "img" is deliberately NOT loaded for training; it is fetched only for the final results.
TRAIN_PROJECTION = {
    "_id": 1, "propertyType": 1, "status": 1, "size": 1,
    "latitude": 1, "longitude": 1, "location": 1, "price": 1,
}


# ---------------------------------------------------------------- helpers
def to_jsonable(data):
    """Recursively convert ObjectId -> str and Binary/bytes -> base64 string."""
    if isinstance(data, list):
        return [to_jsonable(item) for item in data]
    if isinstance(data, dict):
        return {k: to_jsonable(v) for k, v in data.items()}
    if isinstance(data, ObjectId):
        return str(data)
    if isinstance(data, Binary):
        return base64.b64encode(data.bytes).decode("utf-8")
    if isinstance(data, bytes):
        return base64.b64encode(data).decode("utf-8")
    return data


def normalize(values: np.ndarray) -> np.ndarray:
    span = values.max() - values.min()
    return (values - values.min()) / span if span > 0 else np.zeros_like(values, dtype=float)


# ---------------------------------------------------------------- model
@dataclass(frozen=True)
class ModelState:
    """Immutable snapshot. A refresh builds a new one and swaps the reference atomically."""
    df: pd.DataFrame
    features: np.ndarray
    knn: NearestNeighbors


def build_state() -> ModelState:
    docs = list(collection.find({}, TRAIN_PROJECTION))
    if len(docs) < 2:
        raise ValueError(f"Need at least 2 houses to train, found {len(docs)}")

    df = pd.DataFrame(docs)
    for col in CATEGORICAL + NUMERICAL:
        if col not in df.columns:
            df[col] = np.nan

    df["_id"] = df["_id"].astype(str)
    for col in NUMERICAL:
        df[col] = pd.to_numeric(df[col], errors="coerce")
    df = df.dropna(subset=NUMERICAL)
    df = df[df["latitude"].between(-90, 90) & df["longitude"].between(-180, 180)]
    df[CATEGORICAL] = df[CATEGORICAL].fillna("unknown").astype(str)
    df = df.reset_index(drop=True)

    if len(df) < 2:
        raise ValueError(f"Only {len(df)} houses have usable size/coordinates; need at least 2")

    encoder = OneHotEncoder(sparse_output=False, handle_unknown="ignore")
    scaler = StandardScaler()
    features = np.hstack([
        scaler.fit_transform(df[NUMERICAL]),
        encoder.fit_transform(df[CATEGORICAL]),
    ])

    # +1 because the house itself is always returned as its own nearest neighbour
    knn = NearestNeighbors(n_neighbors=min(21, len(df)), metric="euclidean")
    knn.fit(features)
    return ModelState(df=df, features=features, knn=knn)


def recommend(state: ModelState, house_id: str, top_n: int = 4):
    matches = state.df.index[state.df["_id"] == house_id]
    if len(matches) == 0:
        return None
    idx = int(matches[0])

    distances, indices = state.knn.kneighbors(state.features[idx:idx + 1])
    pairs = [(d, i) for d, i in zip(distances[0], indices[0]) if i != idx]
    if not pairs:
        return []

    knn_distance = np.array([p[0] for p in pairs], dtype=float)
    candidates = state.df.iloc[[p[1] for p in pairs]].copy()

    target = state.df.iloc[idx]
    target_coords = (target["latitude"], target["longitude"])
    geo_distance = np.array(
        [geodesic(target_coords, (r.latitude, r.longitude)).km for r in candidates.itertuples()],
        dtype=float,
    )

    candidates["knn_distance"] = knn_distance
    candidates["geo_distance"] = geo_distance
    candidates["combined_score"] = 0.7 * normalize(knn_distance) + 0.3 * normalize(geo_distance)

    top = candidates.sort_values("combined_score").head(top_n)
    # to_json converts NaN -> null and numpy types -> plain JSON
    records = json.loads(top.to_json(orient="records"))
    return attach_images(records)


def attach_images(records):
    """Fetch the (potentially large) img field only for the few houses being returned."""
    if not records:
        return records
    ids = [ObjectId(r["_id"]) for r in records]
    images = {
        str(doc["_id"]): to_jsonable(doc.get("img"))
        for doc in collection.find({"_id": {"$in": ids}}, {"img": 1})
    }
    for r in records:
        r["img"] = images.get(r["_id"])
    return records


# ---------------------------------------------------------------- app
async def refresh_loop(app: FastAPI):
    while True:
        try:
            state = await asyncio.to_thread(build_state)  # keeps the event loop free
            app.state.model = state
            log.info("Model refreshed with %d houses", len(state.df))
        except Exception:
            log.exception("Model refresh failed; keeping previous model (if any)")
        await asyncio.sleep(REFRESH_SECONDS)


@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.model = None
    task = asyncio.create_task(refresh_loop(app))  # server starts immediately; model loads in background
    yield
    task.cancel()
    client.close()


app = FastAPI(lifespan=lifespan)

if ALLOWED_ORIGINS:  # Express calls this server-to-server, so CORS is only needed if a browser calls it directly
    app.add_middleware(
        CORSMiddleware,
        allow_origins=ALLOWED_ORIGINS,
        allow_methods=["GET"],
        allow_headers=["*"],
    )


def verify_api_key(x_api_key: Optional[str] = Header(default=None)):
    if API_KEY and not hmac.compare_digest(x_api_key or "", API_KEY):
        raise HTTPException(status_code=401, detail="Unauthorized")


@app.get("/health")
def health():
    model: Optional[ModelState] = app.state.model
    return {"status": "ok", "model_ready": model is not None, "houses": 0 if model is None else len(model.df)}


@app.get("/r/recommend/{house_id}", dependencies=[Depends(verify_api_key)])
def recommend_houses(house_id: str):
    if not ObjectId.is_valid(house_id):
        raise HTTPException(status_code=400, detail="Invalid ID format")

    model: Optional[ModelState] = app.state.model
    if model is None:
        raise HTTPException(status_code=503, detail="Model is still loading")

    try:
        recommendations = recommend(model, house_id)
    except Exception:
        log.exception("Recommendation failed for %s", house_id)
        raise HTTPException(status_code=500, detail="Recommendation failed")

    if recommendations is None:
        raise HTTPException(status_code=404, detail="House not found")
    return {"recommendations": recommendations}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))