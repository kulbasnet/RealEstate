const express = require('express');
const { mongoose } = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const app = express();
const houseRoutes = require('./routes/houseRoutes');
const userRoutes = require('./routes/userRoutes');

const port = process.env.PORT || 8000;

// Middleware 
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/house', houseRoutes);
app.use('/', userRoutes);

// Database connection function
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected');
    } catch (err) {
        console.error('MongoDB connection error:', err.message);
        process.exit(1); // Exit process with failure
    }
};

// Start the server and connect to the database
const startServer = async () => {
    await connectDB(); // Wait for the database connection
    // Default routing
    app.get('/', (req, res) => {
        res.json('Hi house!');
    });

    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
};

// Call the startServer function
startServer();
