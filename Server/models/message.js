const mongoose = require('mongoose');
const {Schema } = mongoose;


const messageSchema = new Schema ({

    name:{
        type:String,
        required:[true, "Personal name is required too"]
    },

    email:{
        type:String,
        required:[true, "email is nedded"],
        unique:true
    },
    
    message:{
        type:String,
        required:[true,"Some important short message is needed"]
    }
})

const message = mongoose.model('message', messageSchema);
module.exports = message;