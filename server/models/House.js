const mongoose = require('mongoose');
const {Schema} = mongoose;

const houseSchema = new Schema({
    location:{
        type:String,
        required : [true, "House location is required"]
    },
    price :{
        type:Number,
        required:[true, 'price is required']
    },

    size:{
        type: Number,
        required:[true, "House size is required"]
     },

    listedBy:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:'User',
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

    }

})


const House = mongoose.model('House', houseSchema)
module.exports = House;
