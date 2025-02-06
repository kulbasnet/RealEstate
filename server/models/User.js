const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    uid: { type: String, 
        unique: true, 
        required: true 
    },

    name: {
        type: String,
        required: [true, "Personal Name is required"],
    },

    email: {
        type: String,
        required: [true, "email is necessary"],
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    favouriteHouse: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'House',
        default: [],
    },
    isAgent: {
        type: Boolean,
        default: false

    },

    isVerified:{
        type:Boolean,
        default:false

    },
    phoneNumber: { 
        type: String,
        required: function () {
            return this.isAgent;
        }
    },
    createdHouse:{
        type:[ mongoose.Schema.Types.ObjectId],
        ref:'House',
        default:[],
    },
    message:{
        type: String

    },
    resetPasswordToken:String,
    resetPasswordExpiresAt:Date,
    verificationToken:String,
    verificationTokenExpiresAt:Date 


})


const User = mongoose.model("User", userSchema);
module.exports = User;