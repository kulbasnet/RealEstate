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
const {sendPasswordResetEmail, sendResetSuccessEmail, sendWelcomeEmail, sendVerificationEmail} = require("../Resend/email");



const userSignUp = async (req, res) => {
    try {
        const { name, email, password, isAgent, phoneNumber } = req.body;

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
    const {code} = req.body;
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

        await sendWelcomeEmail(user.email,user.name);
        res.status(200).json({success:true,message:"Email verifified succesfully"});
    }catch(error){
        console.log("Error verifiying emails",error);
        res.status(400).json({success:false,message:error.message});
        
    }

}




// const userGooglesign =async (req,res)=>{
//     try{
//         let {email,password,uid,name} = req.user;

//         if(!password){
//             console.log("password missing, setting default password");
//             password="RandomPassword";
//         }

//         let user = await userModel.findOne({uid});
//         if(!user){
//             user=new userModel({uid,name,password,email});
//             await user.save();
            
//         }else{
//             res.json(user);
//         }
        
//     }catch(error){
//         console.error("Database error:",error.message);
//         res.status(500).json({success:false, error:error.message});
//     }
// }

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

    } catch (err) {
        res.status(400).json({ error: err.message })
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
            return res.status(400).json({success:false, message:`${error.message}`});
        }

      const resetPasswordToken= crypto.randomBytes(32).toString("hex");
        const resetPasswordExpiresAt=Date.now()+1*60 *60*1000;

        user.resetPasswordToken = resetPasswordToken;
        user.resetPasswordExpiresAt = resetPasswordExpiresAt;
        // await user.save();
        await user.save();
        await sendPasswordResetEmail(user.email,`${process.env.CLIENT_URL}/reset-password/${resetPasswordToken}`);

        res.status(200).json({success:true, message:"Successfully reset password email sent"});


    }catch(error){
        console.log("eroor on sending reset password email",error);
        res.status(400).json({success:false,message:error.message});
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
        console.log("Error sending welcome email",error);
        res.status(400).json({success:false, message:error.message});

    }


}

const getUser = async (req, res) => {
    try {
        const users = await userModel.find();
        const agents = users.filter(user => user.isAgent);
        res.status(200).json({ message: "Users with their information", user : agents})
    } catch (error) {
       return res.status(400).json({ message: "Sorry could not fo it ", error });
    };
}

module.exports = {
    userSignUp,
    userLogin,
    getUser,
    verifyEmail,
    userLogout,
    forgetPassword,
    resetPassword
    // userGooglesign
}
