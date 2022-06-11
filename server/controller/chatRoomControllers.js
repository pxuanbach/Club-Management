const User = require('../models/User')
const Club = require('../models/Club')
const Message = require('../models/Message')
const ChatRoom = require('../models/ChatRoom')
const mongoose = require('mongoose');
const async = require('async')
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
    
    socket.on('search-user', searchValue => {
        User.find({
            $or: [
                { username: { $regex: searchValue } },
                { name: { $regex: searchValue } },
                { email: { $regex: searchValue } }
            ]
        }).limit(8).then(result => {
            console.log(searchValue, result)
            socket.emit('user-searched', result)
        })
    })

    socket.on('sendMessage', async (user_id, type, content, room_id, callback) => {
        const user = getUser({ user_id, room_id });
        //console.log('send message user', user)
        let roomId = room_id; //change if room doesn't exist
        const splitRoomId = room_id.split('_');
        if (splitRoomId.length > 1) {
            const roomIdArr = [
                splitRoomId[0] + "_" + splitRoomId[1],
                splitRoomId[1] + "_" + splitRoomId[0]
            ]
            const rooms = await ChatRoom.find({ room_id: { $in: roomIdArr } })
            if (rooms.length > 0) {
                roomId = rooms[0].room_id;
            } else {
                console.log("không tìm thấy")
                const newRoom = await ChatRoom.create({ room_id })
                roomId = newRoom.room_id;
            }
        }
        const msgToStore = {
            author: user_id,
            type,
            content,
            room_id: roomId,
        }
        //console.log('message', msgToStore)
        const msg = new Message(msgToStore);
        msg.save().then(m =>
            m.populate('author')
                .execPopulate()
                .then(result => {
                    //console.log('send mess', result)
                    io.emit('message', result);
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
                const splitRoomId = item._id.split('_');     //id_id
                if (splitRoomId.length > 1) {
                    const receiver = splitRoomId[0] === user_id ? splitRoomId[1] : splitRoomId[0];
                    User.findById(receiver).then(user => {
                        Message.find({ room_id: item._id })
                            .sort({ createdAt: -1 })
                            .limit(1)
                            .then(msg => {
                                //console.log(club.name, msg[0].content)
                                const data = {
                                    room_id: item._id,
                                    imgUrl: user.img_url,
                                    name: user.name,
                                    lastMessage: msg[0].content,
                                    createdAt: msg[0].createdAt
                                }
                                arrData.push(data)
                                callback();
                            }).catch(err => {
                                console.log("Message query err - " + err.message)
                                return;
                            })
                    })
                } else {
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
                                    lastMessage: msg[0].content,
                                    createdAt: msg[0].createdAt
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
                }
            }, function (err) {
                if (err) {
                    console.log("Foreach err - " + err.message)
                    return;
                }
                socket.emit('output-list-room', arrData.sort(function (a, b) {
                    return new Date(b.createdAt) - new Date(a.createdAt);
                }))
            })

        })
    })
}