const adminModel =require("../models/AdminMo");
const bcrypt = require("bcrypt");
const message = require("../models/message");
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");
const { generateJWTToken } = require("../utils/generateJWTToken");
const { sendVerificationEmail, sendWelcomeEmail, sendPasswordResetEmail, sendResetSuccessEmail } = require("../Resend/nodemail");
const {generateVerificationToken} = require("../utils/generateVerificationToken");
const crypto = require("crypto");




const createUser = async(req,res)=>{
    try{
        const {name, phoneNumber, email, password, isAdmin} = req.body;
        const img = req.file;

            console.log("Recieved Body", req.body);
            console.log("Recieved file", req.file);

        //   if (!name) {
        //             return res.json({ error: 'Name is required' });
        //         }
        //         if (!email) {
        //             return res.status(400).json({ success: false, message: 'Email is required' });
        //         }
        //         if (!password || password.length < 6) {
        //             return res.status(400).json({success:false, message:"Please Enter atleast 6 digits"});
        //          }

                 const existingAdmin= await adminModel.findOne({email});
                 if(existingAdmin){
                  return  res.status(404).json({success:false, message:"Sorry email is already on use"});

                 }

                 const hashedPassword = await bcrypt.hash(password, 6);
                 const verificationToken = generateVerificationToken();
                 
                 const admin= new adminModel({
                    name,
                    email,
                    password: hashedPassword,
                    phoneNumber,
                    isAdmin,
                    img:{
                        data: img.buffer,
                        contentType: img.mimetype
                    },
                    verificationToken: verificationToken,
                    verificationTokenExpiresAt: Date.now() + 24*60*60 *1000
                 })
                 await admin.save();
                 generateJWTToken(res, admin._id);
                 await sendVerificationEmail(admin.email, verificationToken)

                 res.status(201).json({success:true, message:"admin Registered", admin:{
                    ...admin._doc,
                    password:undefined
                 }});


    }catch(error){

        res.status(400).json({success:false, error: error.message});

    }

}


const adminLogin = async(req,res)=>{
    try{
        const {email , password} = req.body;

        const admin =await adminModel.findOne({email});
        if(!admin || !(await bcrypt.compare(password, admin.password))){
            res.status(400).json({success:false, message: "Invalid credintails"});
        }

        const token = jwt.sign(
            {
                _id: admin._id,
                email: admin.email,
                name: admin.name,
                isAdmin : admin.isAdmin,  
}, 
        process.env.JWT_SECRET,
        {expiresIn : '1h'}
        );

        res.status(200).json({success:true, message: "Admin Logged IN", token, isAdmin: admin.isAdmin});

    }catch(error){
                res.status(400).json({ error: error.message })
        
    }

}


const adminVerify=async(req,res)=>{
    const {code} = req.body;

    try{

        const admin = await adminModel.findOne({
            verificationToken: code,
            verificationTokenExpiresAt: { $gt: Date.now()},
        })

        if(!admin){
            return res.status(404).json({success: false, message:"Invalid or expired verifucation code"});
        }

        admin.isVerified= true;
        admin.verificationToken = undefined;
        admin.verificationTokenExpiresAt= undefined;
        admin.verificationTokenExpiresAt= undefined;
        await admin.save();

        sendWelcomeEmail(admin.email, admin.name).catch(e=>(e=> console.error("Welcome email failed", e)));
        res.status(200).json({success:true, message: "Email verified successfull"});


    }catch(error){
        console.log("Erorr verifying email", error);
        res.status(404).json({success: false, message: error.message});

    }
}


const adminForget = async(req,res)=>{
    const {email} = req.body;
    try{
        const admin  = await adminModel.findOne({email});
        if(!admin){
            return res.status(404).json({sucess:false, message:"Sorry no such admin"});
        }

        const resetPasswordToken = crypto.randomBytes(32).toString("hex");
        const resetPasswordExpiresAt = Date.now()+1*60*60*1000;

        admin.resetPasswordToken= resetPasswordToken;
        admin.resetPasswordExpiresAt = resetPasswordExpiresAt;
        await admin.save();
        await sendPasswordResetEmail(admin.email, `${process.env.CLIENT_URL}/adminResetPassword/${resetPasswordToken}`);
      res.status(200).json({success:true, message:"Successfully reset password email sent"});
        

    }catch(error){
                console.log("eroor on sending reset password email",error);
                res.status(400).json({success:false,message:error.message});
        

    }
}



const adminResetPassword = async(req,res)=>{
    const {token} = req.params;
    const {password} = req.body;

    try{
        const admin = await adminModel.findOne({
            resetPasswordToken: req.params.token,
            resetPasswordExpiresAt: {$gt:Date.now()},
        })

        // if(!admin){
        //     return res.status(400).json({success: false, message: "No such admin"});

        // }

        const hashedPassword = await bcrypt.hash(password, 10);
        admin.password = hashedPassword;
        admin.resetPasswordToken = undefined;
        admin.resetPasswordExpiresAt = undefined;
        await admin.save();

        await sendResetSuccessEmail(admin.email);
        res.status(200).json({success:true, message: "Passwrod reset Successfull"});


    }catch(error){
                console.log("Error sending welcome email",error);
                res.status(400).json({success:false, message:error.message});
        
    }
}








const adminInfo = async(req, res)=>{
    try{

        const admin = await adminModel.findById(req.admin._id);

        if(!admin){
            res.status(404).json({success:false, message:"Sorry no such admins"});

        }

     
        let adminwithImages = {...admin._doc}
        if(admin.img && admin.img.data){
            const base64img = admin.img.data.toString('base64');
            adminwithImages.img = `data: ${admin.img.contentType}; base64, ${base64img}`
        }
        

         res.status(200).json({success:true, data: adminwithImages});



    }catch(error){
        res.status(500).json({success:false, message: error.message});

    }

}


const adminDelete= async(req, res)=>{
    try{
        const {id} = req.params;

       
        const objectId = new mongoose.Types.ObjectId(id);
        const admin = await adminModel.findOne(objectId);

        if(!admin){
          return  res.status(404).json({success:false, message:"SOrry no such admisn"})
        }
  
        const data= await adminModel.findOneAndDelete({_id: objectId});
        if(!data){
           return res.status(404).json({success:false, message:"SOrry no such Admins"});


        }

        res.status(200).json({success:true, deleted: data});




    }catch(error){
                res.status(500).json({success:false, message: error.message});
        

    }
}



const adminUpdate= async(req,res)=>{
    try{
        const { id } = req.params;
        const updatedAdmin = req.body;
        const img= req.file;

        console.log("Request Body:", req.body);
        console.log("Uploaded File:", req.file);


        const objectId = new mongoose.Types.ObjectId(id);

        const updated = { ...updatedAdmin };

        if(img){
            
            updated.img = {
                data: img.buffer,
                contentType: img.mimetype
            };

        }


        const admin = await adminModel.findOneAndUpdate(
            { _id: objectId},
            { $set: updated},
            { new: true, runValidators: true}

        )

        if(!admin) {
            res.status(404).json({success: false, message: error.message});
        }

        const adminResponse = admin.toObject();
        if(admin.img && admin.img.data){
            adminResponse.img.data = adminResponse.img.data.toString("base64");
        }

        res.status(200).json({success: true, message: "Admin Updataed", adminResponse});



    }catch(error){
        res.status(500).json({success: false, message: error.message});



    }
}


module.exports ={createUser, adminLogin, adminInfo, adminDelete, adminUpdate, adminVerify, adminForget, adminResetPassword};