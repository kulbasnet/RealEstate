const express = require('express');
const router = express.Router();
const {userLogin, userSignUp} = require('../controllers/userControllers');

router.post('/Login' , userLogin);
router.post('/Signup', userSignUp );

module.exports = router;