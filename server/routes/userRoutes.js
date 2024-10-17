const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const { userLogin, userSignUp, getUser } = require('../controllers/userControllers');

router.post('/login', userLogin);
router.post('/sign', userSignUp);
router.get('/getUser',authenticate ,getUser);


module.exports = router;