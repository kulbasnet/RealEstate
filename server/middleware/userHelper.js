const bcrypt = require('bcrypt');

 const hashedPassword = async (password) =>{
    if(typeof password !== String){
        throw new Error ("password must be string")

    }

    try{
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash;
        return(hash);

    }catch(err){
        res.status(400).json({success:false, message: err.message});
    }
    
 }


 //ashyncorounsly compare password with hashed value
 const comparedPassword = async (password, hashed)=>{

    if(typeof password !==String  || typeof hashed !==String){
        res.status(400).json({success:false , message: "invalid inputs"})
    }
    try{
        return await bcrypt.compare(password,hashed)
    }catch(err){
        res.status(400).json({success:false , message: err.message});


    }
    return bcrypt.compare(password,hashed)
 }


 module.exports ={
    hashedPassword,
    comparedPassword
 }