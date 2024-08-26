const houseModel = require('../models/House');
const userModel = require('../models/User');
const messageModel = require('../models/message')

const createHouse = async (req,res)=>{
    try{
        const {name,location, price, propertyNumber, propertyType,status}= req.body;

        if(!name || !location || !price || !propertyNumber || !propertyType || !status) {
            res.status(400).json({
                success:false, 
                message: "You have to list all the required elements"})

        }

        const existingHouse = await houseModel.findOne({
            name,
            location,
            propertyNumber
        });

        if (existingHouse) {
            return res.status(400).json({
                success: false,
                message: "house already exists with the given name, location, and property number"
            });
        }

        //Create NewHouse
        const newHouse = await houseModel.create({name,location, price, propertyNumber, propertyType,status});
        res.status(200).json({
            success:true, 
            message:"New house Added",
            newHouse});


    }catch(err){
        res.status(400).json({success:false, error: err.message})
    }

}

const searchHouse = async(req,res)=>{
    try{
        const {name} = req.query;
        const nameArray = name.split(",");
        const houses = await houseModel.find({ name: {$in : nameArray}});
        if (houses.length === 0 ){
            return res.status(404).json({success: true , message : "Sorry no such Houses"});

        }

        return res.status(200).json({sucess:true, houses });



    }catch(err){
        res.status(400).json({sucess:false , Message: err.message});
    }

}


const addToFavourite = async (req,res)=>{
    // bookid is to be send as payload, capture it with req.body
    const {name} = req.body;

    try{
        const houseName = await houseModel.findOne({name});
        if(!houseName){
            res.status(400).json({success:false, message:"Sorry no such houses on that name"});
        }

    console.log(res.User.name);

     // Fetch the user from the database
    const user = await userModel.findOne({name});
    if(!user){
        res.status(400).json({message:"sorry no such user found"});
    }

    user.favouriteHouse.push(name);
    await user.save;

    res.status(200).json({sucess:true, 
        message:"house added to favourite", 
        favouriteHouse: req.user.favouriteHouse});

    }catch(err){
        res.status(400).json({success:false, message: err.message});
    }

}


    
const getFavouritehouse = async(req, res)=>{

    try{
        const user = await userModel.findOne(req.user.name).populate('favouriteHouse');
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

    if(typeof name !== 'string' || name.trim()===""){
        res.json({message: "Sorry please correct name"});
    }

    if(typeof email!='string' || !email.includes('@')){
        res.status(400).json({message:'Use the correct way to provide your email'})
    }

    const newMessage = new messageModel ({name, email , message});
    await newMessage.save()

    res.status(200).json({ message: "Thank you for reaching out. We will get back to you soon!" });


    }catch(err){
        res.status(400).json({message:"Sorry error occured Try again later"})
    }
    
}




module.exports = {searchHouse, createHouse,addToFavourite,getFavouritehouse ,getinTouch};
