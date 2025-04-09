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
    },
    
    message:{
        type:String,
        required:[true,"Some important short message is needed"]
    },
    date:{
        type: Date,
        required:[true, "Date is mandatory"],
        default: Date.now

    },

    status:{
        type: String,
        enum:['Pending', "Confirmed", "Cancelled"],
        default: "Pending"

    },

    from:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    
    },
    to:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"

    },
    phoneNumber:{
        type: String,
        required: true


    },
    time:{
        type: String,
        required : true
    }

}, 
    {timestamps: true}
)

const message = mongoose.model('message', messageSchema);
module.exports = message;