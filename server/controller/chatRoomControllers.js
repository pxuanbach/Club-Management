const User = require('../models/User')
const Club = require('../models/Club')
const Message = require('../models/Message')
const mongoose = require('mongoose');
const async = require('async')
const { addUser, getUser } = require('../helper/ChatRoomHelper');

module.exports = function (socket, io) {
    socket.on('sendMessage', (user_id, type, content, room_id, callback) => {
        console.log(socket.id)
        const user = getUser({ user_id, room_id });
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
            .sort({ createdAt: 1 })
            .then(result => {
                //console.log(result)
                socket.emit('output-messages', result)
            })
    })

    socket.on('get-list-room', user_id => {
        //console.log(user_id)

        Message.aggregate([
            {
                $match: {
                    author: mongoose.Types.ObjectId(user_id)
                }
            },
            {
                $group: {
                    _id: "$room_id",
                }
            },
        ], function (err, result) {
            if (err) {
                console.log("Query err - " + err.message)
                return;
            }
            //console.log(result)
            let arrData = []
            async.forEach(result, function (item, callback) {
                Club.findById(item._id).then(club => {
                    Message.find({ room_id: item._id })
                        .sort({ createdAt: -1 })
                        .limit(1)
                        .then(msg => {
                            //console.log(club.name, msg[0].content)
                            const data = {
                                room_id: item._id,
                                imgUrl: club.img_url,
                                name: club.name,
                                lastMessage: msg[0].content
                            }
                            arrData.push(data)
                            callback();
                        }).catch(err => {
                            console.log("Message query err - " + err.message)
                            return;
                        })
                }).catch(err => {
                    console.log("Club query err - " + err.message)
                    return;
                })
            }, function (err) {
                if (err) {
                    console.log("Foreach err - " + err.message)
                    return;
                }
                socket.emit('output-list-room', arrData)
            })

        })
    })
}