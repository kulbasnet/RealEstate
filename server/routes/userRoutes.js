const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');

const authenticate = require('../middleware/authenticate');
const requireSelfOrAdmin = require('../middleware/requireSelfOrAdmin');
const upload = require('../middleware/upload');
const {
    userLogin, userSignUp, getUser, verifyEmail, userLogout, forgetPassword, resetPassword,
    updateUser, searchUser, userAlphabetSort, userDelete, userInfo, getUserOnly,
} = require('../controllers/userControllers');

// Brute-force / abuse protection for credential and email endpoints (needs app.set('trust proxy', 1), already in index.js)
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 30,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many attempts, please try again later.' },
});

// ---- public ----
router.post('/login', authLimiter, userLogin);
router.post('/sign', authLimiter, upload.single('img'), userSignUp);
router.post('/verifyEmail', authLimiter, verifyEmail);
router.post('/logout', userLogout);
router.post('/forgetPassword', authLimiter, forgetPassword);
router.post('/reset-password/:token', authLimiter, resetPassword);
router.get('/searchAgent', searchUser);
router.get('/userAlphabet', userAlphabetSort);

// ---- logged in ----
router.get('/getUser', authenticate, getUser);
router.get('/userInfo', authenticate, userInfo);
router.get('/getUserOnly', authenticate, getUserOnly);

// ---- logged in AND (the owner of :id OR an admin) ----
// authenticate and the ownership check run BEFORE multer, so strangers can't upload files.
router.put('/updateUser/:id', authenticate, requireSelfOrAdmin, upload.single('img'), updateUser);
router.delete('/userDelete/:id', authenticate, requireSelfOrAdmin, userDelete);

module.exports = router;