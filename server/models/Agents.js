const mongoose = require('mongoose');
const { Schema } = mongoose; 

const AgentSchema = new Schema({
    name: {
        type: String,
        required: [true, "Name is necessary"]
    },
    phoneNumber: { 
        type: String, 
        required: [true, "Phone number is required"]
    },
    email: {
        type: String,
        required: [true, "Email is necessary"],
        unique: true
    },
    description:{
        type:String,
        required:[true,"About yourself is required"]

    },

    message: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "message" 
    }]
});

const Agent = mongoose.model("Agent", AgentSchema); 
module.exports = Agent;
