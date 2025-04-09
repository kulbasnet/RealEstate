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

     Bedroom:{
        type: Number,

     },
     Bathrooms:{
        type: Number,

     },

     status:{
        type:String,
        required:[true,'required']
     },


     listedBy: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: [true, "Agent Name is Required"]
      },

    propertyNumber:{
        type:Number,
        required:[true,'Property number is necessary']
    },

    latitude:{

     type:Number
     
    }
,
    longitude:{
        type:Number
    },
    
    propertyType:{
        type:String,

    },

    Description:{
        type: String,
    },

    img:{
        data:Buffer,
        contentType:String

    },
    
},     {timestamps: true}
)


const House = mongoose.model('House', houseSchema)
module.exports = House;
