const mongoose = require('mongoose');
const { Schema } = mongoose; 

const AgentSchema = new Schema({
    name: {
        type: String,
        required: [true, "Name is necessary"]
    },
    phoneNumber: { // Changed to camelCase
        type: String, // Changed to String for phone numbers
        required: [true, "Phone number is required"]
    },
    email: {
        type: String,
        required: [true, "Email is necessary"],
        unique: true
    },

    image:{
        data:Buffer,
        required:[true, "Image is also required" ],
        contentType:String


    },


    message: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "message" 
    }]
});

const Agent = mongoose.model("Agent", AgentSchema); 
module.exports = Agent;
