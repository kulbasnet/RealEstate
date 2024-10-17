const { default: mongoose } = require('mongoose');
const houseModel = require('../models/House');
const userModel = require('../models/User');
const messageModel = require('../models/message');


const createHouse = async (req,res)=>{
    try{
        const {size,location, price, propertyNumber, propertyType,listedBy}= req.body;
        const img=req.file;

        console.log("recieved body....",req.body);

        console.log("recieved file....",req.file)


        if (!img) {
           return res.status(400).json({
                success: false,
                error: "No image file uploaded"
            });
        }

        if(!size || !location || !price || !propertyNumber || !propertyType  || !listedBy) {
           return res.status(400).json({
               success:false, 
                error: "You have to list all the required elements"})

        }

        const existingHouse = await houseModel.findOne({
            location, 
            propertyNumber
        });

        if (existingHouse) {
            return res.status(400).json({
                success: false,
                message: "house already exists with the given  location, and property number"
            });
        }

        //Create NewHouse
        const newHouse = await houseModel.create({size,location, price, propertyNumber, propertyType    ,listedBy,img:{
            data:img.buffer,
            contentType:img.mimetype
    
        }});

        const user= await userModel.findById(req.user.id);
        if (user) {
         user.createdHouse.push(newHouse._id); 
         await user.save();
     }


    }catch(err){
        res.status(400).json({success:false, error: err.message})
    }

}


const updateHouse = async(req,res)=>{
    const {houseId}= req.params;
    console.log("HouseID:",houseId);
    try{
        const HouseUpdate= await houseModel.findByIdAndUpdate(houseId, req.body,{
            new:true,
            runValidators:true,
        })

        if(!HouseUpdate){
            return res.status(404).json({ success: false, message: "House not found" });

        }

        res.status(200).json({success:true,data:HouseUpdate});

    }catch(error){
        res.status(404).json({success:false,error:error.message});
    }   
}

const getHouse = async(req,res)=>{
    try{
        const houses = await houseModel.find();
        // res.status(200).json({message:"Houses with their info", houses})


        const housewithImages = houses.map((house)=>{
            if(house.img && house.img.data){
                const base64img= house.img.data.toString('base64');
                return{
                    ...house._doc,
                    img:`data:${house.img.contentType}; base64,${base64img}`
                }
            }
            return house;

        })
        // console.log(housewithImages);
        res.status(200).json({
            success: true,
            houses: housewithImages
        });

    }catch(error){
        console.error("Error fetching houses:", error.message);
        res.status(404).json({error:"Sorry",error});

    }
}

const searchHouse = async(req,res)=>{
    try{
        const {location} = req.query;
        const locationArray = location.split(",");
        const houses = await houseModel.find({ location: {$in : locationArray}});
        if (houses.length === 0 ){
            return res.status(404).json({success: true , error : "Sorry no such Houses"});
        }
        return res.status(200).json({success:true, houses });


    }catch(err){
        res.status(400).json({sucess:false , error: err.message});
    }

}


const addToFavourite = async (req, res) => {
    const { houseId } = req.body;

    try {
        console.log("HOuse id", houseId);
        const houseName = await houseModel.findOne({ houseId });
        if (!houseName) {
            return res.status(400).json({ success: false, error: "Sorry, no house found with that ID" });
        }

        // Log user ID for debugging
        console.log(req.user.id);

        // Fetch the user from the database using their ID
        const user = await userModel.findById(req.user.id);
        if (!user) {
            return res.status(400).json({ error: "Sorry, no user found" });
        }

        // Add the houseId to the user's favouriteHouse array and save
        user.favouriteHouse.push(houseId);
        await user.save();

        res.status(200).json({
            success: true, 
            message: "House added to favourites", 
            favouriteHouse: user.favouriteHouse
        });

    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};


    
const getFavouritehouse = async(req, res)=>{

    try{
        const user = await userModel.findOne(req.user.id).populate('favouriteHouse');
        if(!user){
            res.status(400).json({success:false,message:"sorry no such user"});
        }
        res.status(200).json({success:true , message:user.favouriteHouse})

    }
    catch(err){
        res.status(400).json({success:false, error: err.message});
    }

}


const getAgentHouse = async (req, res) => {
    try {
        const user = await userModel.findById(req.user.id).populate('createdHouse');
        // console.log("User",user);
        // console.log("Created House",user?.createdHouse);
        
        if (!user || !user.createdHouse.length) {
            return res.status(400).json({ success: false, error: "No houses found that you have created." });
        }
        res.status(200).json({ success: true, agentHouse: user.createdHouse });
    } catch (error) {
        res.status(404).json({ success: false, error: error.message });
    }
};

const houseDelete  =  async(req,res)=>{
    const {houseId} = req.params;

    if(!mongoose.Types.ObjectId.isValid(houseId)){
        return res.status(400).json({ success:false,error:"Invalid Request"})
    }

    try{
        const house = await houseModel.findByIdAndDelete(houseId)
        if(!house){
         return   res.status(404).json({success:false, error:"Sorry no such house to delete"})

        }
        const user =await userModel.findById(req.user.id);
        if(!user){
          return  res.status(404).json({success:false,error:"No such user"})
        }

        if(!user.createdHouse.includes(houseId)){
          return  res.status(403).json({success:false,error:"Sorry since you didnot created house You cannot delete it"});
        }
        user.createdHouse =  user.createdHouse.filter(id=> id.toString() !== houseId);
        await user.save();
    }catch(error){
        return res.status(404).json({success:false, error:"Sorry ssome error occured"})
    }
}





const getinTouch = async (req,res)=>{
    try{

        const {name, email,message} = req.body;

    if(!name||typeof name !== 'string' || name.trim()===""){
        res.json({error: "Sorry please correct name"});
    }

    if(!email||typeof email!='string' || !email.includes('@')){
        res.status(400).json({error:'Use the correct way to provide your email'})
    }

    if(message.length<0){
        res.status(400).json({error:"Please give the message"});
    }

    const newMessage = new messageModel ({name, email , message});
    await newMessage.save()
    res.status(200).json({ message: "Thank you for reaching out. We will get back to you soon!" });


    }catch(err){
        res.status(400).json({error:"Sorry error occured Try again later"})
    }
    
}




module.exports = {getAgentHouse,getHouse,searchHouse, createHouse,addToFavourite,getFavouritehouse ,houseDelete,getinTouch,updateHouse};
