const express = require('express');
const router = express.Router();
const multer = require('multer');
const rateLimit = require('express-rate-limit'); // npm i express-rate-limit

const authentication = require('../middleware/authenticate');
const requireAdmin = require('../middleware/requireAdmin');
const {
    createUser, adminLogin, adminInfo, adminDelete, adminUpdate,
    adminVerify, adminForget, adminResetPassword,
} = require('../controllers/AdminController');

// Uploads are held in memory, so they MUST be size-limited and type-checked.
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 2 * 1024 * 1024, files: 1 }, // 2 MB
    fileFilter: (req, file, cb) =>
        file.mimetype.startsWith('image/') ? cb(null, true) : cb(new Error('Only image uploads are allowed')),
});

// Brute-force protection for credential / code endpoints (needs app.set('trust proxy', 1) in index.js)
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many attempts, please try again later.' },
});

// Creating admin accounts: only an existing admin may do it.
// To bootstrap the very first admin, temporarily set ALLOW_ADMIN_SIGNUP=true, create it, then set it back to false.
const adminSignupGate = (req, res, next) => {
    if (process.env.ALLOW_ADMIN_SIGNUP === 'true') return next();
    return authentication(req, res, (err) => (err ? next(err) : requireAdmin(req, res, next)));
};

router.post('/adminLogin', authLimiter, adminLogin);
router.post('/createUser', adminSignupGate, upload.single('img'), createUser);
router.get('/adminInfo', authentication, adminInfo);
router.delete('/adminDelete/:id', authentication, requireAdmin, adminDelete);
router.put('/adminUpdate/:id', authentication, upload.single('img'), adminUpdate); // self or admin, checked in controller
router.post('/adminVerify', authLimiter, adminVerify);
router.post('/adminForget', authLimiter, adminForget);
router.post('/adminResetPassword/:token', authLimiter, adminResetPassword);

module.exports = router;