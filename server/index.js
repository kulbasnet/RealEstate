const express = require('express');
const { mongoose } = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();
const app = express();
const houseRoutes = require('./routes/houseRoutes');
const userRoutes = require('./routes/userRoutes');
const recommendationRoutes = require('./routes/recommendationRoute');
const adminRoute = require("./routes/AdminRoute");
const port = process.env.PORT || 8000;
// const Admin = require('../server/models/Admin');

// Middleware
app.set('trust proxy', 1); // trust first proxy (needed for rate-limiting behind a reverse proxy)
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
const allowedOrigins = (process.env.CLIENT_URL || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
app.use(cors({
    origin: allowedOrigins.length ? allowedOrigins : true,
    credentials: true
}));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
    const dbReady = mongoose.connection.readyState === 1;
    res.status(dbReady ? 200 : 503).json({ status: dbReady ? 'ok' : 'db_unavailable' });
});

app.use('/house', houseRoutes);
app.use('/', userRoutes);
app.use("/adminRoute", adminRoute);
app.use('/A', recommendationRoutes);


// error handler (must come after all routes)
app.use((err, req, res, next) => {
    if (err.code === 'LIMIT_FILE_SIZE') return res.status(413).json({ success: false, message: 'File too large (max 2 MB)' });
    console.error(err);
    res.status(err.status || 500).json({ success: false, message: 'Something went wrong' });
});


const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            dbName: process.env.MONGO_DB_NAME || "test",
            serverSelectionTimeoutMS: 10000,

        });
        console.log('MongoDB connected');
    } catch (err) {
        console.error('MongoDB connection error:', err.message);
        process.exit(1); // Exit process with failure
    }
};

const startServer = async () => {
    await connectDB(); // Wait for the database connection
    app.get('/', (req, res) => {
        res.json('Hi house!');
    });

    const server = app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });

    const shutdown = (signal) => {
        console.log(`${signal} received, shutting down`);
        server.close(async () => {
            await mongoose.connection.close();
            process.exit(0);
        });
    };
    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
};


// Call the startServer function
startServer();