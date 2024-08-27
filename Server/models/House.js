const mongoose = require('mongoose');
const {Schema} = mongoose;

const houseSchema = new Schema({
    name:{
       type: String,
       required:[true, "House Name is required"]
    },
    location:{
        type:String,
        required : [true, "House location is required"]
    },
    price :{
        type:Number,
        required:[true, 'price is required']
    },

    listedBy:{
        type:String,
        required:[true, "Agent Name is Required"]

    },

    propertyNumber:{
        type:Number,
        required:[true,'Property number is necessary']
    },

    propertyType:{
        type:String,

    },

    img:{
        data:Buffer,
        contentType:String

    },

    status:{
        type:Boolean,
        required:true,
        default:false

    }

})


const House = mongoose.model('House', houseSchema)
module.exports = House;
