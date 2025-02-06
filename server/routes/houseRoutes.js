const express = require('express');
const router = express.Router();
const { getHouse, searchHouse, createHouse, addToFavourite, getFavouritehouse,houseDelete,getinTouch,getAgentHouse,updateHouse } = require('../controllers/houseControllers');
const authenticate = require('../middleware/authenticate');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

router.get('/searchHouse', searchHouse);
router.post('/createHouse', authenticate, upload.single('img'), createHouse);
router.post('/addToFavourite', authenticate, addToFavourite);
router.get('/favouriteHouse', authenticate, getFavouritehouse);
router.post('/touch', authenticate, getinTouch);
router.get('/getHouse',getHouse);
router.delete('/delete/:houseId',authenticate,houseDelete);
router.get('/agentHouse',authenticate,getAgentHouse);
router.put('/updateHouse/:houseId',authenticate,updateHouse);



module.exports = router;