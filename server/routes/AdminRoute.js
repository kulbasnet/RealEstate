const express = require('express');
const router = express.Router();
const authentication = require('../middleware/authenticate');
const {createUser, adminLogin, adminInfo, adminDelete, adminUpdate, adminVerify, adminForget, adminResetPassword } = require("../controllers/AdminController");
// const adminAuthenticate = require("../middleware/adminAuthenticate");
const multer = require("multer");
const upload = multer({storage: multer.memoryStorage()});


router.post("/adminLogin", adminLogin);
router.post("/createUser", upload.single('img'), createUser);
router.get("/adminInfo", authentication , adminInfo);
router.delete("/adminDelete/:id", authentication, adminDelete);
router.put("/adminUpdate/:id", upload.single('img'), adminUpdate);
router.post("/adminVerify", adminVerify);
router.post("/adminForget", adminForget);
router.post("/adminResetPassword/:token", adminResetPassword)





module.exports = router;