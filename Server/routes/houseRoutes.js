const express  = require('express');
const router = express.Router();
const {searchHouse, createHouse , addToFavourite,getFavouritehouse,getinTouch} = require('../controllers/houseControllers');

router.get('/searchHouse', searchHouse);
router.post('/', createHouse);
router.post('/addFavourite',addToFavourite);
router.get('/favouriteHouse', getFavouritehouse);
router.post('/touch', getinTouch);

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

module.exports=  router;