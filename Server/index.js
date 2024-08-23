const express = require('express');
const { mongoose } = require('mongoose');
const cors = require('cors');
const app = express();
const dotenv = require('dotenv').config();
const houseRoutes = require('./routes/houseRoutes');
const userRoutes = require('../Server/routes/userRoutes');
const House = require('../Server/models/House');
const User = require('../Server/models/User');
const authenticate = require('../Server/middleware/authenticate');
const message = require('../Server/models/message');


const port = 6001;



//Middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use('/house', houseRoutes);
app.use('/', userRoutes);
app.use(cors({
    origin: 'http://localhost:5174', // Allow requests from this origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow these HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow these headers
  }));


//dATBASE CONNECTION
mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log('Datbase Connected'))
.catch((err)=> console.log('databse not connected',err));


//Default routing
app.get('/', (req, res) => {
    res.json('Hi house!');
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});