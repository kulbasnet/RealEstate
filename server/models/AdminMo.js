const mongoose = require("mongoose");
const { Schema } = mongoose;


const adminSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true

    },
    phoneNumber:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    isAdmin:{
        type: Boolean,
        default: true
    },
    isVerified:{
        type: Boolean,
        default: false

    },
    img:{
        data:Buffer,
        contentType:String
    },
    resetPasswordToken:String,
    resetPasswordExpiresAt:Date,
    verificationToken:String,
    verificationTokenExpiresAt:Date
})


const Admin  = mongoose.model("Admin", adminSchema);
module.exports = Admin;