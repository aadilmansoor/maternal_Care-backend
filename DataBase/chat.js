


//  Chat box




//  Chat box


const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    userId: {
        type: String
    },
    username: {
        type: String
    },
    message: {
        type: []
    },
    userUnreadcount: {
        type: Number,
        default: 0
    },
    adminUnreadcount: {
        type: Number,
        default: 0
    }
}, { timestamps: true }); // Enable timestamps within the same object

const Chat = mongoose.model('Chat', chatSchema);


module.exports = Chat;
