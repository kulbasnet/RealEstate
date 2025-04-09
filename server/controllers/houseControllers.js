const { default: mongoose } = require('mongoose');
const houseModel = require('../models/House');
const userModel = require('../models/User');
const messageModel = require('../models/message');
const message = require('../models/message');
const { geoCordinate} = require("../utils/geoCordinate");
const { sendBookingConfirmation } = require('../Resend/nodemail');


const createHouse = async (req,res)=>{
    try{
        const {size,location, price, propertyNumber, propertyType,listedBy, Bedroom, Bathrooms, Description,status, latitude, longitude}= req.body;
        const img=req.file;

        console.log("recieved body....",req.body);

        console.log("recieved file....",req.file)


        // const coordinates = await geoCordinate(location);

        // if(!coordinates){
        //     return res.status(404).json({success:false, message:"Invalid Location"})
        // }




        if (!img) {
           return res.status(400).json({
                success: false,
                error: "No image file uploaded"
            });
        }

        if(!size || !location || !price || !propertyNumber || !propertyType) {
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
        const newHouse = await houseModel.create({size,location, price, propertyNumber, propertyType, Bathrooms, Bedroom, Description,status,
            latitude: parseFloat(latitude) ,
            longitude: parseFloat(longitude),  
            listedBy: req.user.id,  
            img:{
            data:img.buffer,
            contentType:img.mimetype
    
        }});

        const user= await userModel.findById(req.user.id);
        if (user) {
         user.createdHouse.push(newHouse._id); 
         await user.save();
     }

     res.status(201).json({
        success: true,
        house: newHouse
    });


    }catch(err){
        res.status(400).json({success:false, error: err.message})
    }

}



const getLatestHouse=async (req,res)=>{
    try{
        const Houses = await houseModel.find().sort({createdAt: -1}).populate("listedBy", "name img phoneNumber");

        const housewithImages = Houses.map((house)=>{
            if(house.img && house.img.data){
                const base64img = house.img.data.toString('base64');
                return{
                    ...house._doc,
                    img: `data:${house.img.contentType}; base64, ${base64img}`
                }
            }
            return house;

        })

        res.status(200).json({
            success: true,
            Houses: housewithImages
        });





    }catch(error){
        console.error("Error fetching house", error.message);
        res.status(404).json({error: "Sorry", error});

    }



}


const priceSorting=async(req,res)=>{
    const {price} = req.params;
    const {sort}= req.query;
    try{
        let sortOrder= -1;

        if(sort === "asc"){
            sortOrder=1;
        }
        const houses = await houseModel.find({price}).sort({price: sortOrder});
        if(houses.length===0){
            res.status(404).json({success: false, message: "Sorry no houses can be found"});
            return;
        }
        res.status(200).json({success:true, message: "HOuses", house: houses});


    }catch(error){
        res.status(500).json({success:false, message: error.message});

    }}


const HouseTypeSort= async(req,res)=>{
    const {type} = req.query;
    const {propertyType}= req.params;

    try{
        const houseType= await houseModel.find({propertyType});

        const houseTypeWithImages = houseType.map((house)=>{
            if(house.img.data && house.img){
                const base64img = house.img.data.toString('base64');
                return{
                    ...house._doc,
                    img:`data:${house.img.contentType}; base64, ${base64img}`
                }
            }
        })

        if(houseTypeWithImages.length===0){
            res.status(404).json({success: false, message:"Sorry no prortpty Type houses"});
            return;
        }

        if(type==="Land"){
            houseTypeWithImages= houseTypeWithImages.filter(house =>house.propertyType === "Land" );
        }else if(type === "Apartment"){
            houseTypeWithImages= houseTypeWithImages.filter(house => house.propertyType === "Apartment");

        }else if(type==="Flat"){
            houseTypeWithImages = houseTypeWithImages.filter(house=> house.propertyType === "Flat");
        
        }else if(type==="House"){
        houseTypeWithImages = houseTypeWithImages.filter(house=> house.propertyType === "House");
    }


        res.status(200).json({success:true, data: houseTypeWithImages});


    }catch(error){
        res.status(505).json({success: false, message: error.message});

    }



} 

const houseFilter = async (req, res) => {
    try {
        const { status, propertyType } = req.query;
        const filter = {};

        if (status) filter.status = status;
        if (propertyType) filter.propertyType = propertyType;

        const houses = await houseModel.find(filter)
            .populate('listedBy', 'name phoneNumber img')
            .lean();

        const processedHouses = houses.map(house => {
            const processed = { ...house };

            if (house.img?.data) {
                processed.img = `data:${house.img.contentType};base64,${house.img.data.toString('base64')}`;
            }

            if (house.listedBy?.img?.data) {
                processed.listedBy = {
                    ...house.listedBy,
                    img: `data:${house.listedBy.img.contentType};base64,${house.listedBy.img.data.toString('base64')}`
                };
            }

            return processed;
        });

        res.status(200).json({ 
            success: true, 
            data: processedHouses 
        });

    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};
const houseStatus = async(req,res)=>{
    const {status}= req.params;
    const {houseStat} = req.query;

   try{
        const House = await houseModel.find({status});

        if(House.length===0){
            res.status(404).json({success:false, message: "Sorry No message"});
        }




        if(houseStat === "Sale"){
          House= House.filter(house=> house.status ==="Sale");

        }else if(houseStat==="Rent"){
            House= House.filter(house=> house.status==="Rent");
        }
        res.status(200).json({success:true, message:"Your filitered House according to your status" , data: House});

    }catch(error){
        res.status(300).json({success: false, message: error.message});

    }

}





const updateHouse = async (req, res) => {
    const { houseId } = req.params;
    const img = req.file;
    const updatedHouse = req.body;

    try {
        const objectId = new mongoose.Types.ObjectId(houseId);
        const updateData = { ...updatedHouse };

        if (img) {
            updateData.img = {
                data: img.buffer,
                contentType: img.mimetype
            };
        }

        const HouseUpdate = await houseModel.findOneAndUpdate(
            { _id: objectId },  // Changed from houseId to _id
            { $set: updateData },
            {
                new: true,
                runValidators: true
            }
        );

        if (!HouseUpdate) {
            return res.status(404).json({ success: false, message: "House not found" });
        }

        const houseUp = HouseUpdate.toObject();
        if (houseUp.img?.data) {
            houseUp.img.data = houseUp.img.data.toString("base64");
        }

        res.status(200).json({ success: true, data: houseUp });

    } catch (error) {
        console.error("Update Error:", error);  // Added error logging
        res.status(500).json({ success: false, error: error.message });
    }
};

const getHouse = async(req,res)=>{
    try{
        const houses = await houseModel.find().populate('listedBy', 'name');
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
        if (!houseId) {
            return res.status(400).json({ success: false, error: "House ID is required" });
        }

        console.log("Received House ID:", houseId);

        // Ensure house exists
        const house = await houseModel.findById(houseId);
        if (!house) {
            return res.status(400).json({ success: false, error: "Sorry, no house found with that ID" });
        }

        // Ensure user exists
        const user = await userModel.findById(req.user.id);
        if (!user) {
            return res.status(400).json({ success: false, error: "Sorry, no user found" });
        }

        // Ensure `favouriteHouse` is an array
        if (!Array.isArray(user.favouriteHouse)) {
            user.favouriteHouse = [];
        }

        // Prevent duplicate entries
        if (user.favouriteHouse.includes(houseId)) {
            return res.status(400).json({ success: false, message: "House is already in favourites" });
        }

        // Add house to favourites
        user.favouriteHouse.push(houseId);
        await user.save();

        res.status(200).json({
            success: true,
            message: "House added to favourites",
            favouriteHouse: user.favouriteHouse
        });

    } catch (err) {
        console.error("Error adding to favourites:", err.message);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};

    
const getFavouritehouse = async (req, res) => {
    try {
        // Validate user existence
        const user = await userModel.findById(req.user.id).populate('favouriteHouse');
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: "User not found" 
            });
        }

        // Check if favorite houses exist
        if (!user.favouriteHouse || user.favouriteHouse.length === 0) {
            return res.status(200).json({ 
                success: true, 
                message: "No favorite houses found",
                data: [] 
            });
        }

        // Return favorite houses
        res.status(200).json({ 
            success: true, 
            message: "Favorite houses retrieved successfully",
            data: user.favouriteHouse 
        });

    } catch (err) {
        console.error("Error fetching favorite houses:", err);
        res.status(500).json({ 
            success: false, 
            message: "Internal server error",
            error: process.env.NODE_ENV === 'development' ? err.message : undefined 
        });
    }
};
const getAgentHouse = async (req, res) => {
    try {
        const user = await userModel.findById(req.user.id).populate('createdHouse');
        //  console.log("User",user);
        // c onsole.log("Created House",user?.createdHouse);
        
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
    const {houseId} = req.params;

    try{

        const {name, email,message, date, phoneNumber} = req.body;

    if(!name||typeof name !== 'string' || name.trim()===""){
        res.json({error: "Sorry please correct name"});
    }

    if(!email||typeof email!='string' || !email.includes('@')){
        res.status(400).json({error:'Use the correct way to provide your email'})
    }

    if(message.length<0){
        res.status(400).json({error:"Please give the message"});
    }

    const house = await houseModel.findById(houseId);
    if(!house){
        return res.status(404).json({message:"sorry no such house" })
    }

    const agent = await userModel.findById(house.listedBy);
        if (!agent) {
            return res.status(404).json({ error: "Agent not found." });
        }

    const newMessage = new messageModel ({name, 
        email , 
        message,
        phoneNumber, 
        date: new Date(date), 
        from: req.user.id, 
         to: house.listedBy
 });
    await newMessage.save()
    
    const user= await userModel.findById(req.user.id);
    if(user){
        user.message.push(newMessage._id);
        await user.save();
    }
    
    agent.message.push(newMessage._id);
    await agent.save();
    res.status(200).json({ message: "Thank you for reaching out. We will get back to you soon!" });


    }catch(err){
        res.status(400).json({error: err.message});
    }
    
}


const getMessage = async (req, res) => {
    try {
        const user = await userModel.findById(req.user.id)
            .populate({
                path: 'message',
                populate: {
                    path: 'to from',
                    select: 'name email img phoneNumber'
                }
            });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (!user.message || user.message.length === 0) {
            return res.status(200).json({ 
                success: true,
                message: "No messages found",
                data: []
           
            });
        }

        // Process each message to convert 'to' and 'from' images
        const processedMessages = user.message.map(message => {
            const processUser = (user) => {
                if (user?.img?.data) {
                    const base64img = user.img.data.toString('base64');
                    return {
                        ...user._doc,
                        img: `data:${user.img.contentType};base64,${base64img}`
                    };
                }
                return user;
            };

            return {
                ...message._doc,
                to: processUser(message.to),
                from: processUser(message.from)
            };
        });

        res.status(200).json({
            success: true,
            message: "Messages retrieved successfully",
            data: processedMessages
        });

    } catch (error) {
        console.error("Error in getMessage:", error);
        res.status(500).json({
            success: false,
            message: "Server error while retrieving messages"
        });
    }
};


const updateMessage = async(req,res)=>{

    const {messageId} = req.params;
    try{
        const objectId = new mongoose.Types.ObjectId(messageId);


        const message  = await messageModel.findOneAndUpdate(
            { _id : objectId },
            { $set : req.body},
            {
                new: true,
                runValidators: true
            }
            
        )
        if(!message){
            res.status(404).json({success: true, message: "Sorry no such message"});

        }

        res.status(200).json({success: true, data: message});
    }catch(error){
        console.log("Error", error);
        res.status(505).json({success: false, error: error.message});

    }

     
}

const updateStatus = async (req, res) => {
    const { messageId } = req.params;
    const { status } = req.body; // Get status directly from request body
    
    try {
      const message = await messageModel.findByIdAndUpdate(
        messageId,
        { status }, 
        { new: true, runValidators: true }
      );
  
      if (!message) {
        return res.status(404).json({ 
          success: false, 
          message: "Message not found" 
        });
      }

      if(status === "Confirmed" || status === "Cancelled"){
        await sendBookingConfirmation(message.from.email, status);

      }
  
      res.status(200).json({ 
        success: true, 
        data: message 
      });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ 
        success: false, 
        error: error.message 
      });
    }
  };


  const getLatestMessage = async(req, res)=>{
    try{

        const user = await userModel.findById(req.user.id).populate({
            path:"message",
            options : {
                sort: {createdAt: -1}

            },
            populate:{
                path: 'to from',
               select: "name email img"
            }
        });

        if(!user){
            return res.status(404).json({success: false, message: "User not found"});
        }

        if (!user.message || user.message.length === 0) {
            return res.status(200).json({ 
                success: true,
                message: "No messages found",
                data: []
            });
        }

        const processedFilter = user.message.map(message=>{
            const process = (user)=>{
                if(user.img.data){
                    const base64img =  user.img.data.toString('base64');
                    return{
                        ...user._doc,
                        img: `data: ${user.img.contentType}; base64, ${base64img}`
                    };
                }
                return user;
            }

            return{
                ...message._doc,
                to: process(message.to),
                from : process(message.from)
            };
        })


        res.status(200).json({
            success: true, 
            message: "Latest messages",
            data : processedFilter
        })



    }catch(error){
        console.error("Error", error);
        res.status(500).json({
            success: false,
            message: error.message
        });



    }





  }







module.exports = { getMessage, 
                   houseFilter, 
                   getAgentHouse,
                   getHouse,
                   searchHouse, 
                   createHouse,
                   addToFavourite,
                   getFavouritehouse ,
                   houseDelete,
                   getinTouch,
                   updateHouse, 
                   getLatestHouse, 
                   priceSorting, 
                   HouseTypeSort, 
                   houseStatus,
                   updateStatus,
                   getLatestMessage, 
                   updateMessage
                };
 