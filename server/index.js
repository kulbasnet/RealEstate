const express = require('express');
const { mongoose } = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const app = express();
const houseRoutes = require('./routes/houseRoutes');
const userRoutes = require('../Server/routes/userRoutes');

const port = process.env.PORT || 8000;

//Middleware 
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/house', houseRoutes);
app.use('/', userRoutes);

//dATBASE CONNECTION
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Datbase Connected'))
    .catch((err) => console.log('databse not connected', err));

//Default routing
app.get('/', (req, res) => {
    res.json('Hi house!');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});