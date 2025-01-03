const express = require('express');
const router = express.Router();
const { getHouse, searchHouse, createHouse, addToFavourite, getFavouritehouse,houseDelete,getinTouch,getAgentHouse,updateHouse } = require('../controllers/houseControllers');
const authenticate = require('../middleware/authenticate');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

router.get('/searchhouse', searchHouse);
router.post('/createhouse', authenticate, upload.single('img'), createHouse);
router.post('/addToFavourite', authenticate, addToFavourite);
router.get('/favouriteHouse', authenticate, getFavouritehouse);
router.post('/touch', authenticate, getinTouch);
router.get('/getHouse',getHouse);
router.delete('/delete/:houseId',authenticate,houseDelete);
router.get('/agentHouse',authenticate,getAgentHouse);
router.put('/updateHouse/:houseId',authenticate,updateHouse);


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