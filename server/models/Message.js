const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    room_id: {
        type: String,
        required: true
    }
}, {timestamps: true})

const Message = mongoose.model('message', messageSchema)
module.exports = Message;

