const mongoose= require('mongoose');
const {Schema} = mongoose;

const userSchema = new Schema({
    name:{
        type:String,
        required : [true, "Personal Name is required"],
        unique: true

    },

    email:{
        type:String,
        required : [true, "email is necessary"],
        unique: true

    },

    password:{
        type:String,
        required:true

    },

    favouriteHouse:[{
        type:mongoose.Schema.Types.ObjectId, ref:"House"}],

    createdHouse:[{
        type: mongoose.Schema.Types.ObjectId, ref:'House'}]
})


const User = mongoose.model("user", userSchema);
module.exports = User;