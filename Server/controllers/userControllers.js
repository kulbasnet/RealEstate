const User = require('../models/User');
// const {hashedPassword, comparedPassword} = require('../helper/userHelper');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSignUp = async(req,res)=>{
   
     
    try {
        const { name, email, password } = req.body;

        // Check if the email or username already exists
        const existingUser = await User.findOne({ $or: [{ email }, { name }] });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Email or username already in use' });
        }

        if (!name) {
            return res.json({ error: 'Name is required' });
        }
        // Check if password is good
        if (!password || password.length < 6) {
            return res.json({ error: 'Password is required and should be at least 6 characters' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create and save the user
        const user = new User({ name, email, password: hashedPassword });
        await user.save();

        // Send success response
        res.status(201).json({ success: true, message: 'User registered successfully' });
    } catch (err) {
        // Handle errors
        // console.error('User registration error:', err); // Log error details for debugging
        res.status(400).json({ success: false, error: err.message});
    }
};


const userLogin = async (req,res)=>{
    try{
        const {email,password} = req.body;

        // checking if the user exist or not

    const user = await User.findOne({email});

    if(!user || !(await bcrypt.compare (password,user.password))){
        res.status(400).json({success:false ,message:"Invalid Credintials"});
    }

    const token = jwt.sign(
        {
            id:user.id, 
            email:user.email,
            name:user.name},
            process.env.JWT_SECRET,
        
    );
    res.json({success:true , message:"Logged in", token})
   

    } catch(err){
        res.status(400).json({error:err.message})
    }


}



module.exports = {
    userSignUp,
    userLogin
}



