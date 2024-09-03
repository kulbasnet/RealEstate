const userModel = require('../models/User');
// const {hashedPassword, comparedPassword} = require('../helper/userHelper');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const userSignUp = async(req,res)=>{
   
     
    try {
        const { name, email, password,isAgent,phoneNumber } = req.body;

        const existingUser = await userModel.findOne({ $or: [{ email }, { name }] });
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
        const user = new userModel({ name, email, password: hashedPassword,isAgent ,phoneNumber});
        await user.save();

        // Send success response
        res.status(201).json({ success: true, message: 'User registered successfully' });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message});
    }
};


const userLogin = async (req,res)=>{
    try{
        const {email,password,isAgent} = req.body;

        // checking if the user exist or not

    const user = await userModel.findOne({email});

    if(!user || !(await bcrypt.compare (password,user.password))){
        res.status(400).json({success:false ,error:"Invalid Credintials"});
    }

    const token = jwt.sign(
        {
            id:user.id, 
            email:user.email,
            name:user.name,
            isAgent:user.isAgent},
            process.env.JWT_SECRET,

            {expiresIn:'1h'}
        
    );
    if (isAgent) {
        return res.json({ success: true, message: "Agent logged in", token });
    } else {
        return res.json({ success: true, message: "User logged in", token });
    }

    } catch(err){
        res.status(400).json({error:err.message})
    }


}


const getUser= async (req,res)=>{
   try{
    const user = await userModel.find();
    res.status(200).json({message:"Users with their information",user})
   }catch(error){
    res.status(400).json({message:"Sorry couldnot fo it ", error});
   }
}




module.exports = {
    userSignUp,
    userLogin,
    getUser
}



