from fastapi import FastAPI, HTTPException
from pymongo import MongoClient
from bson import ObjectId, Binary
import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler, OneHotEncoder, MinMaxScaler
from sklearn.neighbors import NearestNeighbors
from geopy.distance import geodesic
from fastapi.middleware.cors import CORSMiddleware
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
import base64
from contextlib import asynccontextmanager
import asyncio
import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parents[1] / ".env")
mongo_uri = os.environ.get("MONGO_URI")
if not mongo_uri:
    raise RuntimeError("MONGO_URI must be configured in the environment")
client = MongoClient(mongo_uri)
db = client[os.environ.get("MONGO_DB_NAME", "test")]
collection = db["houses"]

def convert_objectids(data):
    """Recursively convert ObjectIds to strings and handle Binary/bytes data"""
    if isinstance(data, list):
        return [convert_objectids(item) for item in data]
    elif isinstance(data, dict):
        new_dict = {}
        for k, v in data.items():
            if isinstance(v, ObjectId):
                new_dict[k] = str(v)
            elif isinstance(v, (Binary, bytes)):
                bytes_data = v.bytes if isinstance(v, Binary) else v
                new_dict[k] = base64.b64encode(bytes_data).decode('utf-8')
            else:
                new_dict[k] = convert_objectids(v)
        return new_dict
    elif isinstance(data, (Binary, bytes)):
        bytes_data = data.bytes if isinstance(data, Binary) else data
        return base64.b64encode(bytes_data).decode('utf-8')
    return data

class HouseRecommender:
    def __init__(self):
        self.encoder = OneHotEncoder(sparse_output=False, handle_unknown='ignore')
        self.scaler = StandardScaler()
        self.knn = None
        self.df = None  
        self.features = None  

    async def load_data(self):
        print("Loading data and training model...")
        projection = {
            '_id': 1,
            'propertyType': 1,
            'status': 1,
            'size': 1,
            'latitude': 1,
            'longitude': 1,
            'img': 1,
            'location': 1,
            'price': 1
        }
        raw_data = list(collection.find({}, projection))
        data = convert_objectids(raw_data)
        self.df = pd.DataFrame(data).convert_dtypes()
        self.df['_id'] = self.df['_id'].astype(str)
        
        # Preprocess features
        self._train_model()
        print("Model training complete!")

    def _train_model(self):
        """Train preprocessing and KNN model"""
        categorical = self.encoder.fit_transform(self.df[['propertyType', 'status']])
        numerical = self.scaler.fit_transform(self.df[['size', 'latitude', 'longitude']])
        
        cat_df = pd.DataFrame(
            categorical, 
            columns=self.encoder.get_feature_names_out(['propertyType', 'status'])
        )
        num_df = pd.DataFrame(numerical, columns=['size', 'latitude', 'longitude'])
        self.features = pd.concat([num_df, cat_df], axis=1)
        
        # Train KNN
        max_neighbors = min(20, len(self.df)-1)
        self.knn = NearestNeighbors(n_neighbors=max_neighbors, metric='euclidean')
        self.knn.fit(self.features)

    def get_recommendations(self, target_id):
        
        target_row = self.df[self.df['_id'] == target_id]
        if target_row.empty:
            return None
        
        target = target_row.iloc[0]
        target_idx = target_row.index[0]
        
        # Find neighbors
        distances, indices = self.knn.kneighbors(self.features.iloc[target_idx:target_idx+1])
        candidates = self.df.iloc[indices[0][1:]].copy() 
        
        # Calculate geo distances
        candidates['geo_distance'] = self._calculate_geo_distances(target, candidates)
        candidates['knn_distance'] = distances[0][1:]
        
        mm_scaler = MinMaxScaler()
        candidates['combined_score'] = (
            0.7 * mm_scaler.fit_transform(candidates[['knn_distance']]) +
            0.3 * mm_scaler.fit_transform(candidates[['geo_distance']])
        )
        
        return convert_objectids(
            candidates.sort_values('combined_score').head(4).to_dict('records')
        )

    def _calculate_geo_distances(self, target, candidates):
        """Calculate geographical distances in km"""
        target_coords = (target['latitude'], target['longitude'])
        return [geodesic(target_coords, (row['latitude'], row['longitude'])).km 
                for _, row in candidates.iterrows()]

# FastAPI Setup
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Load data on startup and refresh every 5 minutes"""
    recommender = HouseRecommender()
    await recommender.load_data()
    app.state.recommender = recommender
    # Start background task to refresh data
    async def refresh_data():
        while True:
            await asyncio.sleep(500)  # 5 minutes
            await recommender.load_data()
    asyncio.create_task(refresh_data())
    yield

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# endpoint
@app.get("/r/recommend/{house_id}")
async def recommend_houses(house_id: str):
    print("✅ Recommendation API hit for house ID:", house_id)
    try:
        ObjectId(house_id)  # Validate format
    except:
        raise HTTPException(400, detail="Invalid ID format")
    
    recommender = app.state.recommender
    if not any(recommender.df['_id'] == house_id):
        raise HTTPException(404, detail="House not found")
     
    try:
        recommendations = recommender.get_recommendations(house_id)
        return JSONResponse(
            content=jsonable_encoder({"recommendations": recommendations}),
            status_code=200
        )
    except Exception as e:
        raise HTTPException(500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)