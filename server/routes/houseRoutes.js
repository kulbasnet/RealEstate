const express = require('express');
const router = express.Router();
const { getHouse, searchHouse, createHouse, addToFavourite, getFavouritehouse, getinTouch } = require('../controllers/houseControllers');
const authenticate = require('../middleware/authenticate');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });


router.get('/searchhouse', searchHouse);
router.post('/createHouse', authenticate, upload.single('img'), createHouse);
router.post('/addToFavourite', authenticate, addToFavourite);
router.get('/favouriteHouse', authenticate, getFavouritehouse);
router.post('/touch', authenticate, getinTouch);
router.get('/getHouse', authenticate, getHouse);


// router.delete =  ("/:name",async(req,res)=>{
//     try{
//         const {name}= req.params;
//         const house = await houseModel.findOneAndDelete({name});

//     if(!name){
//         res.status(400).json({success:true, message: "Sorry no such House with that name"})

//     }

//     res.status(200).json({success: true, message:"House Deleted", house});



//     }catch(err){
//         res.status(400).json({success:false, message:err.message});

//     }
// });

module.exports = router;