const User = require('../models/User')
const Message = require('../models/Message')
const { addUser, getUser } = require('../helper/ChatRoomHelper');

module.exports = function (socket, io) {
    socket.on('join', ({ user_id, room_id }) => {
        const { error, user } = addUser({
            socket_id: socket.id,
            user_id,
            room_id
        })
        socket.join(room_id);
        if (error) {
            console.log('join error', error)
        } else {
            console.log('join user', user)
        }
    })

    socket.on('sendMessage', (user_id, type, content, room_id, callback) => {
        console.log(socket.id)
        const user = getUser({user_id, room_id});
        console.log('send message user', user)
        const msgToStore = {
            author: user_id,
            type,
            content,
            room_id,
        }
        //console.log('message', msgToStore)
        const msg = new Message(msgToStore);
        msg.save().then(m => 
            m.populate('author')
            .execPopulate()
            .then(result => {
            //console.log('send mess', result)
            io.to(room_id).emit('message', result);
            callback();
            })
        )
    })

    socket.on('get-messages-history', room_id => {
        Message.find({ room_id })
        .populate('author')
        .sort({createdAt: 1})
        .then(result => {
            //console.log(result)
            socket.emit('output-messages', result)
        })
    })
}