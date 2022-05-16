const mongoose = require('mongoose');

const chatRoomSchema = new mongoose.Schema({
    room_id: {
        type: String,
        required: true
    }
})

const ChatRoom = mongoose.model('chatRoom', chatRoomSchema)
module.exports = ChatRoom;

