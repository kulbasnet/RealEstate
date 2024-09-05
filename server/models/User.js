const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, "Personal Name is required"],
        unique: true
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
    phoneNumber: {
        type: String,
        required: function () {
            return this.isAgent;
        }
    },
    message: [{
        type: String

    }]
})


const User = mongoose.model("User", userSchema);
module.exports = User;