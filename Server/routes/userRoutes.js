const express = require('express');
const router = express.Router();
const {userLogin, userSignUp} = require('../controllers/userControllers');

<<<<<<< HEAD
router.post('/login' , userLogin);
router.post('/sign', userSignUp );
=======
router.post('/Login' , userLogin);
router.post('/Signup', userSignUp );
>>>>>>> 196eb96f7f699c9eea1085eeedb7fd169c3f68ad

module.exports = router;