const express = require('express');
const router = express.Router();

const { userLogin, userSignUp, getUser } = require('../controllers/userControllers');   

router.post('/login' , userLogin);
router.post('/sign', userSignUp );
router.get('/getUser',getUser);


module.exports = router;