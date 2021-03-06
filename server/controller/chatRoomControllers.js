const User = require('../models/User')
const Club = require('../models/Club')
const Message = require('../models/Message')
const ChatRoom = require('../models/ChatRoom')
const mongoose = require('mongoose');
const async = require('async')
const { addUser, getUser } = require('../helper/ChatRoomHelper');
const { uniqueArray } = require('../helper/ArrayHelper')

function convertLastMessage(message) {
    let lastMessage = '';
    switch (message.type) {
        case "text":
            lastMessage = message.content;
            break;
        case "image":
            lastMessage = "[Hình ảnh]"
            break;
        case "file":
            lastMessage = "[Tệp]"
            break;
        default:
            break;
    }
    return lastMessage;
}

module.exports = function (socket, io) {
    socket.on('join', ({ user_id, room_id }) => {
        const { error, user } = addUser({
            socket_id: socket.id,
            user_id,
            room_id
        })
        socket.join(room_id);
        console.log("on join", io.sockets.adapter.rooms)
        if (error) {
            console.log('join error', error)
        } else {
            console.log('join user', user)
        }
    })

    socket.on('search-user', (searchValue, user_id) => {
        let roomsFinded = []
        User.find({
            $or: [
                { username: { $regex: searchValue } },
                { name: { $regex: searchValue } },
                { email: { $regex: searchValue } }
            ]
        }).limit(5).then(users => {
            users.forEach(user => {
                const room = {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    img_url: user.img_url,
                }
                roomsFinded.push(room)
            })
            Club.find({
                $and: [
                    {
                        $or: [
                            { treasurer: user_id },
                            { leader: user_id },
                            { members: user_id },
                        ]
                    },
                    { name: { $regex: searchValue } }
                ]
            })
                .limit(5).then(clubs => {
                    clubs.forEach(club => {
                        const room = {
                            _id: club._id,
                            name: club.name,
                            email: '',
                            img_url: club.img_url,
                        }
                        roomsFinded.push(room)
                    })
                    socket.emit('user-searched', roomsFinded)
                })
        })
    })

    socket.on('sendMessage', async (
        user_id, type, original_filename, content, room_id, callback
    ) => {
        try {
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
                    io.emit("chat-room-created", roomId)
                    socket.join(roomId);
                }
            }
            const msgToStore = {
                author: user_id,
                type,
                original_filename,
                content,
                room_id: roomId,
            }
            //console.log('message', msgToStore)
            const msg = new Message(msgToStore);
            msg.save().then(m =>
                m.populate('author')
                    .execPopulate()
                    .then(async (result) => {
                        //console.log('send mess', result)
                        io.to(roomId).emit('message', result);
                        io.emit('reload-list-room', result)
                        callback();
                    })
            )
        } catch (err) {
            console.log(err.message)
        }
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

    socket.on('get-list-room', async (user_id) => {
        // console.log(user_id)
        const roomIdArr = await getListRoomId(user_id)
        //console.log(roomIdArr)
        let arrData = [];

        async.forEach(roomIdArr, function (item, callback) {
            Message.find({ room_id: item })
                .sort({ createdAt: -1 })
                .limit(1)
                .then(msg => {
                    const splitRoomId = item.split('_');     //id_id
                    if (splitRoomId.length > 1) {
                        const receiver = splitRoomId[0] === user_id ? splitRoomId[1] : splitRoomId[0];
                        User.findById(receiver)
                            .then(user => {
                                if (msg.length > 0) {
                                    const lastMessage = convertLastMessage(msg[0])
                                    const data = {
                                        room_id: item,
                                        imgUrl: user.img_url,
                                        name: user.name,
                                        lastMessage,
                                        createdAt: msg[0].createdAt
                                    }
                                    arrData.push(data)
                                }
                                callback();
                            })
                    } else {
                        Club.findById(item)
                            .then(club => {
                                if (msg.length > 0) {
                                    const lastMessage = convertLastMessage(msg[0])
                                    const data = {
                                        room_id: item,
                                        imgUrl: club.img_url,
                                        name: club.name,
                                        lastMessage,
                                        createdAt: msg[0].createdAt
                                    }
                                    arrData.push(data)
                                }
                                callback();
                            })
                    }
                })
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

    socket.on('leave-room', (room_id) => {
        if (room_id) {
            console.log('leaving socket rooms', socket.adapter.rooms)
            socket.leave(room_id)
            console.log('leaved socket rooms', socket.adapter.rooms)
        }
    })

    socket.on('leave-rooms', () => {
        var rooms = io.sockets.adapter.sids[socket.id]; 
        for(var room in rooms) {       
            socket.leave(room);     
        }
        console.log("on disconnecting io", io.sockets.adapter.rooms)
    })
}

async function getListRoomId(userId) {
    let roomIdArr = [];
    const user = await User.findById(userId).lean();
    user.clubs.forEach(club => {
        const clubId = club.toString();
        roomIdArr.push(clubId)
    })

    const roomIdFromChatRoom = await ChatRoom.find({ room_id: { $regex: userId } })
    roomIdFromChatRoom.forEach(room => {
        roomIdArr.push(room.room_id)
    })
    //console.log("unique", uniqueArray(roomIdArr))
    return uniqueArray(roomIdArr);
}   