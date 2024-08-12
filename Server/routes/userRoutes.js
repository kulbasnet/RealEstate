const express = require('express');
const router = express.Router();
const {userLogin, userSignUp} = require('../controllers/userControllers');

router.post('/login' , userLogin);
router.post('/signup', userSignUp );

module.exports = router;