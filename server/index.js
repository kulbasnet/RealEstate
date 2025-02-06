const express = require('express');
const { mongoose } = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const app = express();
const houseRoutes = require('./routes/houseRoutes');
const userRoutes = require('./routes/userRoutes');
const port = process.env.PORT || 8000;
const admin =require('./firebase');
const User= require('../server/models/User');

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


async function verifyToken(req, res, next) {
    const idToken = req.headers.authorization?.split("Bearer ")[1]; // Ensure proper token format
  
    if (!idToken) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }
  
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      req.user = decodedToken;
      next();
    } catch (error) {
      console.error("Token verification error:", error.message);
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }
  }


  app.post("/protected", verifyToken, async (req, res) => {
    let { uid, email, password, name } = req.user;

    if (!password) {
        console.log("Password missing, setting default password.");
        password = "defaultPassword123";  
    }

    try {
        let user = await User.findOne({ uid });

        if (!user) {
            user = new User({ uid, email, password, name });
            await user.save();
        }else{
            if (user.name !== name) {
            user.name = name;
            await user.save();
            }
        }

        res.json(user);
       
    } catch (error) {
        console.error("Database error:", error.message);
        res.status(500).json({ error: error.message });
    }
});
