const houseModel = require('../models/House');
const userModel = require('../models/User');
const messageModel = require('../models/message');


const createHouse = async (req,res)=>{
    try{
        const {size,location, price, propertyNumber, propertyType,status,listedBy}= req.body;
        const img=req.file;

        console.log("recieved body....",req.body);

        console.log("recieved file....",req.file)


        if (!img) {

            return res.status(400).json({
                success: false,
                error: "No image file uploaded"
            });
        }

        if(!size || !location || !price || !propertyNumber || !propertyType || !status || !listedBy) {
            res.status(400).json({
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
        const newHouse = await houseModel.create({size,location, price, propertyNumber, propertyType,status,listedBy,img:{
            data:img.buffer,
            contentType:img.mimetype
    
        }});
        res.status(200).json({
            success:true, 
            message:"New house Added",
            newHouse});


    }catch(err){
        res.status(400).json({success:false, error: err.message})
    }

}

const getHouse = async(req,res)=>{
    try{
        const houses = await houseModel.find();
        res.status(200).json({message:"Houses with their info", houses})
        

    }catch(error){
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




module.exports = {getHouse,searchHouse, createHouse,addToFavourite,getFavouritehouse ,getinTouch};
