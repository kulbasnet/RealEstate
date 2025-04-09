const userModel = require('../models/User');
// const {hashedPassword, comparedPassword} = require('../helper/userHelper');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');  // Import the uuid function
const {generateVerificationToken}= require('../utils/generateVerificationToken');
const {generateJWTToken} = require('../utils/generateJWTToken');
const User = require('../models/User');
const message = require('../models/message');
const crypto = require('crypto');
const House = require('../models/House');
const {sendPasswordResetEmail, sendResetSuccessEmail, sendWelcomeEmail, sendVerificationEmail} = require("../Resend/nodemail");



const userSignUp = async (req, res) => {
    try {
        const { name, email, password, isAgent, phoneNumber } = req.body;
        const img= req.file;

        console.log("Received boddy", req.body);
        console.log("Receiced file", req.file);

        const uid = uuidv4();

        if (!name) {
            return res.json({ error: 'Name is required' });
        }
        if (!email) {
            return res.status(400).json({ success: false, message: 'Email is required' });
        }
        if (!password || password.length < 6) {
         }

        // Check for existing user
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Email already in use' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password,6);
        const verificationToken= generateVerificationToken();

        // Create and save the user
        const user = new userModel({
            uid, 
            name, 
            email, 
            password: hashedPassword, 
            isAgent, 
            phoneNumber,
            img:{
                data:img.buffer,
                contentType: img.mimetype

            },
            verificationToken:verificationToken,
            verificationTokenExpiresAt: Date.now() + 24* 60*60 *1000 
         });
        await user.save();
        generateJWTToken(res,user._id);
        await sendVerificationEmail(user.email,verificationToken);

        // Send success response
        res.status(201).json({ success: true, message: 'User registered successfully', 
            user:{
                ...user._doc,
                password:undefined
            }
         });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};


const verifyEmail =async (req,res)=>{
    const { code } = req.body;
    
    console.log("Code", code);
    try{
        const  user= await User.findOne({
            verificationToken: code,
            verificationTokenExpiresAt: { $gt:Date.now()},
        })

        if(!user){
            return res.status(400).json({success:false,message:"Invalid or expired verification code"})
        }
        user.isVerified=true;
        user.verificationToken=undefined;
        user.verificationTokenExpiresAt=undefined;
        await user.save();

         sendWelcomeEmail(user.email,user.name).catch(e=> console.error("Welcone error failed", e));
        res.status(200).json({success:true,message:"Email verifified succesfully"});
    }catch(error){
        console.log("Error verifiying emails",error);
        res.status(400).json({success:false,message:error.message});
        
    }

}


const userAlphabetSort = async (req, res) => {
    try {
        const { order = "asc" } = req.query; // Default order is ascending

        const sortedAgents = await userModel.find({ isAgent: true }).sort({ name: order === "desc" ? -1 : 1 });

        if (sortedAgents.length === 0) {
            return res.status(404).json({ success: false, message: "Sorry, no agents found" });
        }

        res.status(200).json({ success: true, message: "Successfully sorted", data: sortedAgents });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const decendingSort = async()=>{
    try{
        const user = await userModel.find({isAgent:true});
        if(user.length===0){
            res.status(404).json({success:true, message:"Sorry Not such agents"});

        }
        const DescindingSort = user.sort((a,b)=> b.name.localeCompare(a.name));
        res.status(200).json({success:true, message:"Descinding Sort", data: DescindingSort});

    }catch(error){
        res.status(500).json({success:false, message: error.message});

    }
}





const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // checking if the user exist or not

        const user = await userModel.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            res.status(400).json({ success: false, error: "Invalid Credintials" });
        }

        const isVerified = user.isVerified;
        if(!isVerified){
            return res.status(400).json({success:false,message:'email is not verified'});
        }

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                name: user.name,
                isAgent: user.isAgent
            },
            process.env.JWT_SECRET,

            { expiresIn: '1h' }

        );
       res.json({success:true, message: user.isAgent ? 'Agent is logged in ': 'User logged in ', token , isAgent: user.isAgent});

    } catch (error) {
        res.status(400).json({sucess: false, message: error.message })
    }
}


const userLogout= async(req,res)=>{
    res.clearCookie("token");
    res.status(200).json({success:true,message:'Logged out'});

}

const forgetPassword =async (req,res)=>{
    const {email}=req.body;
    try{
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({success:false, message:"Sorry user cannot be found "});
        }

      const resetPasswordToken= crypto.randomBytes(32).toString("hex");
        const resetPasswordExpiresAt=Date.now()+1*60 *60*1000;

        user.resetPasswordToken = resetPasswordToken;
        user.resetPasswordExpiresAt = resetPasswordExpiresAt;
        // await user.save();
        await user.save();
        await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetPasswordToken}`);

        res.status(200).json({success:true, message:"Successfully reset password email sent"});


    }catch(error){
        console.log("eroor on sending reset password email", error);
        res.status(400).json({success:false, message: error.message});
    }


}


const resetPassword= async (req,res)=>{
    try{
        const {token} =req.params;
        const {password} = req.body;

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpiresAt: {$gt:Date.now()},
        })

        if(!user){
            return res.status(400).json({success:false,message:"Invalied or expired token"});    

        }
        const hashedPassword = await bcrypt.hash(password,10);
        user.password= hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiresAt = undefined;
        await user.save();

        await sendResetSuccessEmail(user.email);
        res.status(200).json({success:true,message:"Passwrod reset successfully"});

    }catch(error){
        console.log("Error sending welcome email", error);
        res.status(400).json({success:false, message: error.message});

    }


}

const getUser = async (req, res) => {
    try {
        const users = await userModel.find();
        const agents = users.filter(user => user.isAgent);

        const agentWithImages = agents.map((agent)=>{
            if(agent.img.data && agent.img){
                const base64img = agent.img.data.toString('base64');
                return{
                    ...agent._doc,
                    img: `data: ${agent.img.contentType}; base64, ${base64img}`
                }
            }
            return agent;
        })
        res.status(200).json({ message: "Agents with their information", user : agentWithImages})
    } catch (error) {
       return res.status(400).json({ message: "Sorry could not fo it ", error });
    };
};



const getUserOnly = async (req,res)=>{

    try{
        const users = await userModel.find({isAgent: false});
        res.status(200).json({message:"Users inforamtion", users});
        
    }catch(error){
        return res.status(404).json({message:"Sorry cannot found the list of users", error});
    }

}


const userInfo = async (req, res) => {
    try {
        const user = await userModel.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        let userWithImage = { ...user._doc }; // Copy user data
        if (user.img && user.img.data) {
            const base64img = user.img.data.toString("base64");
            userWithImage.img = `data:${user.img.contentType};base64,${base64img}`;
        }

        res.status(200).json({ success: true, user: userWithImage });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};



const mongoose = require("mongoose");

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;  // id is a string
        const updatedUser = req.body;
        const img = req.file;

        const objectId = new mongoose.Types.ObjectId(id);

        const updated = { ...updatedUser };

        if (img) {
            updated.img = {
                data: img.buffer,
                contentType: img.mimetype
            };
        }

        const user = await userModel.findOneAndUpdate(
            { _id: objectId },  // Fixed: id should be wrapped in an object
            { $set: updated },
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const userResponse = user.toObject();
        if (userResponse.img && userResponse.img.data) {
            userResponse.img.data = userResponse.img.data.toString("base64");
        }

        res.status(200).json({ success: true, message: "User updated successfully", userResponse });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const userDelete=async(req,res)=>{


    try{
        const {id} = req.params;

        const objectId = new mongoose.Types.ObjectId(id);

        const user = await userModel.findOne(objectId);
        if(!user){
            res.status(404).json({success:false, message:"Sorry no such users"});
        }

        if(user.createdHouse.length>0){
            await House.deleteMany({
            _id: {$in: user.createdHouse}
            });

        }


        const data = await userModel.findOneAndDelete({_id: objectId});
        if(!data){
            res.status(404).json({success:false, message:"Sorry no such users"})
        }
        res.status(200).json({success:true, deleted: data});

    }catch(error){
        res.status(500).json({success:false, message: error.message});

    }

}


const searchUser= async(req,res)=>{

    try{
        const {name} = req.query;
        const nameArray = name.split(",");
        const agents= await userModel.find({ name: {$in : nameArray}, isAgent: true});
        if (agents.length===0){
            return res.status(404).json({success:false,  message:"Sorry no agents listed" });
    
        }
        return res.status(200).json({success:true, agents});
    

    }catch(error){
        res.status(400).json({success: false, error: error.message});

    }





}

module.exports = {
    userSignUp,
    userLogin,
    getUser,
    verifyEmail,
    userLogout,
    forgetPassword,
    resetPassword,
    updateUser,
    searchUser,
    userAlphabetSort,
    decendingSort,
    userDelete,
    userInfo,
    getUserOnly
}
