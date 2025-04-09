const express = require('express');
const router = express.Router();
const {  houseFilter, 
        getHouse, 
        searchHouse, 
        createHouse, 
        addToFavourite, 
        getFavouritehouse, 
        houseDelete, 
        getinTouch , 
        getAgentHouse, 
        updateHouse, 
        getLatestHouse, 
        priceSorting , 
        HouseTypeSort, 
        houseStatus,
        getMessage,
        updateStatus,
        getLatestMessage,
        updateMessage
                         } = require('../controllers/houseControllers');
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
router.put('/updateHouse/:houseId',authenticate, upload.single('img'),updateHouse);
router.get('/getLatestHouse',getLatestHouse);
router.get("/priceSort", priceSorting );
router.get("/houseFilter",houseFilter);
router.get('/houseSort/:propertyType', HouseTypeSort);
router.get("/houseStatus/:status",houseStatus);
router.post("/getinTouch/:houseId", authenticate, getinTouch);
router.get("/getMessage", authenticate, getMessage);
router.get("/getLatestMessage", authenticate, getLatestMessage);
router.put("/updateStatus/:messageId", authenticate, updateStatus);
router.put("/updateMessage/:messageId", authenticate, updateMessage);




module.exports = router;