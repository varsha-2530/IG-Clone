const mongoose = require('mongoose');

const { ObjectId } = mongoose.Schema.Types

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },

    email: {
        type: String,
        require: true
    },

    password: {
        type: String,
        require: true
    },

    pic: {
        type: String,
        default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxV3_sQFv3Vc7WRcQ4argFh0kIwz--Xqk9Pw&s"
    },

    followers: [{
        type: ObjectId,
        ref: "User"
    }],

    following: [{
        type: ObjectId,
        ref: "User"
    }]


});

module.exports  = mongoose.model('User', userSchema);      