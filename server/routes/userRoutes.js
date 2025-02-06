const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const { userLogin, userSignUp, getUser, verifyEmail, userLogout,forgetPassword, resetPassword } = require('../controllers/userControllers');
// const {verifyToken} =require('../middleware/firebaseToken');

router.post('/login', userLogin);
router.post('/sign', userSignUp);
router.get('/getUser',authenticate ,getUser);
// router.post('/protect',verifyToken,userGooglesign);
router.post('/verifyEmail',verifyEmail);
router.post('/logout',userLogout);
router.post('/forgetPassword',forgetPassword);
router.post('/reset-password/:token',resetPassword);




module.exports = router;     