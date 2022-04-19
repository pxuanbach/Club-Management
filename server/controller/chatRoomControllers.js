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

    socket.on('sendMessage', (type, content, room_id, callback) => {
        const user = getUser(socket.id);
        console.log('send message user', user)
        const msgToStore = {
            user_id: user.user_id,
            type,
            content,
            room_id,
        }
        //console.log('message', msgToStore)
        const msg = new Message(msgToStore);
        msg.save().then(result => {
            User.findById(user.user_id).then(author => {
                const msgObj = Object.assign({}, result._doc)
                msgObj.name = author.name;
                msgObj.img_url = author.img_url;
                //console.log('sendmess', msgObj)
                io.to(room_id).emit('message', msgObj);
                callback();
            })
        })
    })

    socket.on('get-messages-history', room_id => {
        Message.find({ room_id }).sort({createdAt: 'asc'}).then(result => {
            let messages = []
            let l = result.length
            for (let i = 0; i < l; i++) {
                User.findById(result[i].user_id).then(user => {
                    const msgObj = Object.assign({}, result[i]._doc)
                    msgObj.name = user.name;
                    msgObj.img_url = user.img_url;
                    //console.log('msg', msgObj)
                    messages.push(msgObj);
                    if (i === l - 1) {
                        //console.log(messages)
                        socket.emit('output-messages', messages)
                    }
                })
            }
        })
    })
}