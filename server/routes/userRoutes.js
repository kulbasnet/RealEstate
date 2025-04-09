const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const { userLogin, userSignUp, getUser, verifyEmail, userLogout,forgetPassword, resetPassword, updateUser, searchUser, userAlphabetSort, userDelete, userInfo, getUserOnly } = require('../controllers/userControllers');
const multer = require('multer');
// const {verifyToken} =require('../middleware/firebaseToken');
const upload = multer({ storage: multer.memoryStorage()});
// const {verifyToken} = require('../index.js');

router.post('/login', userLogin);
router.post('/sign', upload.single('img'), userSignUp); 
router.get('/getUser',authenticate ,getUser);
// router.post('/protect',verifyToken,userGooglesign);
router.post('/verifyEmail',verifyEmail);
router.post('/logout',userLogout);
router.post('/forgetPassword',forgetPassword);
router.post('/reset-password/:token',resetPassword);
// router.put('updateUser/:id', updateUser);
router.put("/updateUser/:id", upload.single('img'),authenticate, updateUser);
router.get('/searchAgent', searchUser);
router.get('/userAlphabet', userAlphabetSort);
router.delete('/userDelete/:id',authenticate, userDelete);
router.get('/userInfo',  authenticate, userInfo);
router.get("/getUserOnly", authenticate, getUserOnly);




module.exports = router;     