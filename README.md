# Basnet Realties

A full-stack real estate listing application built with React, Express, MongoDB, and a Python recommendation service. Visitors can browse properties, search and filter listings, and view them on a map. Registered users, agents, and administrators have role-specific features for managing profiles, listings, and messages.

> **Project status:** Portfolio project. Email delivery and public deployment require provider credentials and hosting configuration; see [Deployment](#deployment). This README does not mean the application is currently deployed.

## Features

- Browse, search, sort, and filter property listings.
- View property locations on a map and see recommended properties.
- Register and sign in; account verification and password recovery use email.
- Save favorite properties and contact agents about listings.
- Agent dashboard for managing listings and messages.
- Administrator pages for user management and analytics.
- Responsive pages for property search, selling, agents, profiles, and messaging.

## Technology

| Area | Tools |
| --- | --- |
| Frontend | React, Vite, React Router, Tailwind CSS, Axios, Leaflet, GSAP |
| API | Node.js, Express, Mongoose, JWT, Multer, Nodemailer |
| Database | MongoDB |
| Recommendations | Python, FastAPI, pandas, NumPy, scikit-learn, geopy |

## Project structure

```text
RealEstate/
├── client/                   # React/Vite frontend
├── server/                   # Express API and MongoDB models
│   ├── controllers/
│   ├── routes/
│   ├── FastApi/              # Python recommendation API
│   └── Resend/               # Email templates and Nodemailer implementation
└── README.md
```

## Requirements

- Node.js 20 or newer and npm.
- Python 3.10 or newer and pip.
- A MongoDB database (local MongoDB or MongoDB Atlas).
- Gmail with an App Password for the current local email implementation, or another email provider after adapting the email implementation.

## Local setup

### 1. Get the project and install dependencies

From the project root:

```bash
git clone https://github.com/kulbasnet/RealEstate.git
cd RealEstate

cd server
npm install

cd ../client
npm install --legacy-peer-deps

cd ../server/FastApi
python -m venv .venv
source .venv/bin/activate       # Windows PowerShell: .venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

The frontend install uses `--legacy-peer-deps` because the current dependency tree has a React/chart package peer-version conflict.

### 2. Configure environment variables

Create `server/.env` from `server/.env.example` and `client/.env.local` from `client/.env.example`. Fill in the values for your local environment. Do not commit either file.

#### `server/.env`

| Variable | Required | Purpose |
| --- | --- | --- |
| `MONGO_URI` | Yes | MongoDB connection string. |
| `MONGO_DB_NAME` | No | Database name; defaults to `test`. |
| `JWT_SECRET` | Yes | Long, random secret used to sign authentication tokens. |
| `PORT` | No | Express port; defaults to `8000`. The host may set this automatically. |
| `CLIENT_URL` | Recommended | Allowed frontend origin(s), comma-separated if there is more than one. Local value: `http://localhost:5173`. |
| `RECOMMENDATION_API_URL` | Recommended | Python service base URL. Local value: `http://localhost:5000`. |
| `EMAIL_USER` | For email | Gmail address used by Nodemailer. |
| `EMAIL_PASSWORD` | For email | Google App Password, not the normal Google account password. |
| `OPENCAGE_API_KEY` | Optional | OpenCage key for geocoding utility calls. |

#### `client/.env.local`

| Variable | Required | Purpose |
| --- | --- | --- |
| `VITE_API_URL` | Recommended | Base URL for the Express API. Local value: `http://localhost:8000`. |

Vite exposes variables prefixed with `VITE_` in the browser bundle. Put only public values there; never put database passwords, JWT secrets, or email credentials in frontend environment variables.

The Python service reads `MONGO_URI` and `MONGO_DB_NAME` from its process environment. For local development it also loads `server/.env`, so it can use the same MongoDB settings as Express.

### 3. Start the services

Run each command in a separate terminal from the project root.

**Express API**

```bash
cd server
npm run dev
```

The API listens on `http://localhost:8000` by default. `GET /` returns a small health response after MongoDB connects.

**Recommendation API**

```bash
cd server/FastApi
source .venv/bin/activate       # Windows PowerShell: .venv\Scripts\Activate.ps1
uvicorn recommendation_service:app --reload --host 0.0.0.0 --port 5000
```

The recommendation service loads house data and trains its model when it starts. The database must contain at least two valid house records with property type, status, size, latitude, longitude, location, and price fields. An empty or undersized dataset can prevent recommendations from starting correctly.

**React frontend**

```bash
cd client
npm run dev
```

Open the Vite URL printed in the terminal (normally `http://localhost:5173`).

### Password reset flow

1. Open **Forgot Password**, enter the account email, and submit the form.
2. The Express API creates a single-use reset token that expires after one hour and emails a link to the frontend.
3. Open the link to reach `/reset-password/:token`, enter and confirm the new password, then submit.
4. The frontend sends the new password and token to `POST /reset-password/:token`. On success, the password is updated and the user can sign in with it.

For local development on the same computer, set `CLIENT_URL=http://localhost:5173` in `server/.env`. Restart the Express server after changing it, then request a new reset email. The link should look like `http://localhost:5173/reset-password/<token>`; the token is part of the link, not the password itself.

To open the local reset link on a phone connected to the same Wi-Fi, use the computer's LAN IP instead of `localhost`:

1. Start Vite so it accepts connections from other devices:

   ```bash
   cd client
   npm run dev -- --host 0.0.0.0
   ```

2. Set `CLIENT_URL=http://<computer-lan-ip>:5173` in `server/.env`, and set `VITE_API_URL=http://<computer-lan-ip>:8000` in `client/.env.local`. Replace `<computer-lan-ip>` with the computer's actual local IP address.
3. Restart both the Express server and Vite, request a new reset email, and open its link on the phone. Keep the phone and computer on the same Wi-Fi and allow ports `5173` and `8000` through the computer's firewall if needed.

`CLIENT_URL` is also used by Express for CORS, so the frontend origin in the reset link must match the client origin allowed by the API. A link using `localhost` only works on the computer running the services; on a phone, `localhost` refers to the phone itself.

## API overview

All routes below are served by the Express API unless marked **Python**. Request and response fields are defined by the route controllers and models.

### Accounts and agents

| Method | Path | Purpose |
| --- | --- | --- |
| `POST` | `/sign` | Register a user or agent; accepts an optional profile image. |
| `POST` | `/login` | Sign in. |
| `POST` | `/verifyEmail` | Verify an email code. |
| `POST` | `/logout` | Sign out. |
| `POST` | `/forgetPassword` | Request a password reset email. |
| `POST` | `/reset-password/:token` | Set a new password. |
| `GET` | `/getUser` | List/search agent users. |
| `GET` | `/searchAgent` | Search agents. |
| `GET` | `/userAlphabet` | Return agents in alphabetical order. |
| `GET` | `/userInfo`, `/getUserOnly` | Read authenticated user information. |
| `PUT` | `/updateUser/:id` | Update an authenticated user profile. |
| `DELETE` | `/userDelete/:id` | Delete a user. |

### Properties and messages

Property routes are mounted under `/house`.

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/house/getHouse` | List properties. |
| `GET` | `/house/searchHouse` | Search properties. |
| `GET` | `/house/getLatestHouse` | Get recent properties. |
| `GET` | `/house/houseFilter` | Filter properties. |
| `GET` | `/house/priceSort` | Sort properties by price. |
| `GET` | `/house/houseSort/:propertyType` | Filter by property type. |
| `GET` | `/house/houseStatus/:status` | Filter by listing status. |
| `POST` | `/house/createHouse` | Create a listing (authenticated; accepts an image). |
| `PUT` | `/house/updateHouse/:houseId` | Update a listing (authenticated; accepts an image). |
| `DELETE` | `/house/delete/:houseId` | Delete a listing (authenticated). |
| `GET` | `/house/agentHouse` | Get the authenticated agent's properties. |
| `POST` | `/house/addToFavourite` | Save a property to favorites (authenticated). |
| `GET` | `/house/favouriteHouse` | List favorites (authenticated). |
| `POST` | `/house/getinTouch/:houseId` | Contact an agent about a property (authenticated). |
| `GET` | `/house/getMessage`, `/house/getLatestMessage` | Read messages (authenticated). |
| `PUT` | `/house/updateStatus/:messageId` | Update message status (authenticated). |
| `PUT` | `/house/updateMessage/:messageId` | Update a message (authenticated). |
| `GET` | `/A/getRecommend/:houseId` | Express endpoint that requests recommendations from Python. |
| `GET` | `/r/recommend/:house_id` | Python recommendation endpoint. |

### Admin

Admin routes are mounted under `/adminRoute`: `POST /adminLogin`, `POST /createUser`, `GET /adminInfo`, `DELETE /adminDelete/:id`, `PUT /adminUpdate/:id`, `POST /adminVerify`, `POST /adminForget`, and `POST /adminResetPassword/:token`.

## Build and lint

```bash
cd client
npm run build
npm run lint
```

The server's `npm test` script is currently a placeholder and does not run a test suite.

## Deployment

The application has three deployable services plus MongoDB. A free-tier portfolio deployment can use a static host for the frontend, web-service hosts for Express and FastAPI, and MongoDB Atlas Free. Free services may sleep when idle, cold starts can be slow, and free database/storage/usage limits apply. Check each provider's current plan limits before relying on it for real users.

### Example service layout on Render

1. **Frontend static site:** Root directory `client`; build command `npm install --legacy-peer-deps && npm run build`; publish directory `dist`.
2. **Express web service:** Root directory `server`; install dependencies with `npm install`; start command `npm start`.
3. **Recommendation web service:** Root directory `server/FastApi`; build command `pip install -r requirements.txt`; start command `uvicorn recommendation_service:app --host 0.0.0.0 --port $PORT`.
4. **MongoDB:** Use a MongoDB Atlas database. Configure the required network access for the deployed services and use a dedicated database user with only the needed database permissions.

Set `VITE_API_URL` on the frontend build to the public Express API URL. Set `CLIENT_URL` on Express to the deployed frontend origin, and `RECOMMENDATION_API_URL` to the deployed FastAPI service URL. Configure `MONGO_URI`, `MONGO_DB_NAME`, and `JWT_SECRET` as private server environment variables for both backend services. Add email credentials only after configuring an email provider that works with the chosen host.

For React Router page refreshes on a static host, add a rewrite from `/*` to `/index.html` with status `200`.

**Email hosting limitation:** the current email implementation uses Gmail through Nodemailer SMTP. Render Free web services block outbound SMTP ports `25`, `465`, and `587`, so verification and password reset email will not work there with the current implementation. Use a host that allows SMTP or adapt the mailer to use an email provider's HTTPS API. The `resend` package is installed, but the active mailer is still Nodemailer/Gmail; setting a Resend key alone does not switch the implementation.

### Security before deployment or inviting users

- Rotate any database password, email app password, API key, or other credential that was committed or exposed. Removing a secret from the latest file does not remove it from Git history.
- The GitHub repository is public, and the MongoDB connection credential was found in repository history. Rotate that MongoDB database user's password in Atlas immediately; then update local and deployed environment variables. Consider removing the exposed value from repository history after revocation.
- Keep `.env`, `.env.local`, service-account files, and private keys out of commits. Review `git status` and staged changes before pushing.
- Use a clean demo database with sample properties and no personal user data.
- Never put server secrets in `VITE_*` variables or frontend source code.

## Troubleshooting

- **MongoDB connection error:** check `MONGO_URI`, database user permissions, and Atlas network access rules.
- **Verification email reports missing configuration:** set `EMAIL_USER` and `EMAIL_PASSWORD` for the local SMTP implementation; use a Google App Password, not your account password.
- **Recommendation service fails at startup:** verify the MongoDB URI and ensure the database has at least two complete house records.
- **Frontend API requests fail after deployment:** check `VITE_API_URL`, Express `CLIENT_URL` CORS configuration, and that the API service is running.
- **A deployed API is slow on the first request:** a free web service may have been sleeping and needs time to start.

## License

No license is currently specified. Add a `LICENSE` file before allowing reuse of this project.
