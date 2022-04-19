const { ConvertClub, ConvertClubs, ConvertUser, ConvertUsers } = require('../helper/ConvertDataHelper')
const Club = require('../models/Club')
const User = require('../models/User')
const ChatRoom = require('../models/ChatRoom')
const cloudinary = require('../helper/Cloudinary')

module.exports = function (socket, io) {
    socket.on('get-clubs', (user_id, isAdmin) => {
        let query = isAdmin ? {} : {$or: [{ members: user_id }, {'leader._id': user_id}, {'treasurer.id': user_id}]}
        Club.find(query).then(clubs => {
            //console.log('output-clubs: ', clubs)
            socket.emit('output-clubs', ConvertClubs(clubs))
        })

    })

    socket.on('get-club', ({ club_id }) => {
        Club.findOne({ _id: club_id }).then(result => {
            io.emit('output-club', result)
        })
    })

    socket.on('search-club', search => {
        //create search index in mongoDB
        Club.find().then(clubs => {
            let clubArr = []
            clubs.forEach(elm => {
                if (elm.name.includes(search)) {
                    clubArr.push(elm);
                } else if (elm.leader.name.includes(search)) {
                    clubArr.push(elm);
                } else if (elm.treasurer.name.includes(search)) {
                    clubArr.push(elm);
                }
            })
            io.emit('club-searched', ConvertClubs(clubArr))
        })
    })

    socket.on('create-club', (name, img_url, cloudinary_id, description, leader, treasurer, callback) => {
        const club = new Club({ name, img_url, cloudinary_id, description, leader, treasurer });
        club.save().then(result => {
            User.find({ _id: { $in: [leader._id, treasurer._id] } }).then(users => {
                users.forEach(user => {
                    user.clubs.push(result._id)
                    user.save();
                });
            })
            ChatRoom.create({room_id: result._id})
            io.emit('club-created', ConvertClub(result))
            //console.log(result)
            callback();
        })
    })

    socket.on('update-club-info', (club_id, name, description, new_img_url, new_cloud_id, cur_cloud_id, callback) => {
        console.log('club want to update: ', club_id)
        Club.findById(club_id, function (err, doc) {
            if (err) {
                console.log(err)
                return;
            }

            doc.name = name;
            doc.description = description;

            if (new_img_url) {
                cloudinary.uploader.destroy(cur_cloud_id, function (result) {
                    console.log(result);
                })
                doc.img_url = new_img_url;
                doc.cloudinary_id = new_cloud_id;
            }

            doc.save().then(result => {
                let updatedClub = ConvertClub(result)

                io.emit('club-updated', updatedClub)
                console.log(result)
                callback();
            })
        }
        )
        callback();
    })

    socket.on('block-unblock-club', (club_id) => {
        Club.findById(club_id, function (err, doc) {
            if (err) return;
            doc.isblocked = !doc.isblocked;
            doc.save();
        })
    })

    socket.on('delete-club', (club_id, cloudinary_id, callback) => {
        console.log('club want to delete: ', club_id)
        Club.findByIdAndDelete(club_id, function (err, doc) {
            if (err) console.log(err)
            else {
                cloudinary.uploader.destroy(cloudinary_id, function (result) {
                    console.log(result);
                })
                console.log('Delete club:', doc)
                //delete some relation
                //
                //
                io.emit('club-deleted', doc)
            }
        })
        callback();
    })

    socket.on('get-members', club_id => {
        Club.findById(club_id).then(club => {
            User.find({ _id: { $in: club.members } }).then(users => {
                io.emit('output-members', ConvertUsers(users));
            })
        })
    })

    socket.on('get-users-not-members', club_id => {
        Club.findById(club_id).then(club => {
            User.find({
                $and: [
                    { _id: { $nin: club.members } },
                    { _id: { $nin: [club.leader._id, club.treasurer._id] } },
                    { username: { $nin: ['admin', 'admin0'] } },
                ]
            })
                .then(users => {
                    io.emit('output-users-not-members', ConvertUsers(users))
                })
        })

    })

    socket.on('add-member', (club_id, user_id) => {
        Club.findById(club_id, function (err, doc) {
            if (err) return;
            doc.members.push(user_id)
            doc.save();
        })
        User.findById(user_id, function (err, doc) {
            if (err) return;
            doc.clubs.push(club_id)
            doc.save();
        })
    })

    socket.on('remove-user-from-club', (club_id, user_id, callback) => {
        Club.findById(club_id, function (err, doc) {
            if (err) return;
            var newMembers = doc.members.filter(function (value, index, arr) {
                return value != user_id;
            })
            doc.members = newMembers;
            doc.save();

            User.findById(user_id, function (err, doc) {
                if (err) return;
                var newClubs = doc.clubs.filter(function (value, index, arr) {
                    return value != club_id;
                })
                doc.clubs = newClubs;
                doc.save().then(user => {
                    io.emit('removed-user-from-club', ConvertUser(user))
                })
            })
        })
    })

    socket.on('promote-to-leader', (club_id, cur_leader_id, new_leader_id) => {
        Club.findById(club_id, function (err, doc) {
            if (err) return;

            //find new leader info
            User.findById(new_leader_id).then(user => {
                doc.leader = user;

                //exchange new and current leader id
                var newMembers = doc.members.filter(function (value, index, arr) {
                    //console.log('new leader id: ', new_leader_id)
                    return value !== new_leader_id;
                })
                //console.log('new member:', newMembers)
                doc.members = newMembers;
                //console.log('except new leader id:',doc.members)
                console.log('current leader id: ', cur_leader_id)
                doc.members.push(cur_leader_id);
                console.log('add cur leader id:', doc.members)

                doc.save().then(() => {
                    io.emit('promoted-to-leader', user)
                });
            })
        })
    })

    socket.on('promote-to-treasurer', (club_id, cur_treasurer_id, new_treasurer_id) => {
        Club.findById(club_id, function (err, doc) {
            if (err) return;

            //find new treasurer info
            User.findById(new_treasurer_id).then(user => {
                doc.treasurer = user;

                //exchange new and current treasurer id
                var newMembers = doc.members.filter(function (value, index, arr) {
                    return value !== new_treasurer_id;
                })
                doc.members = newMembers;
                //console.log('except new treasurer id:',doc.members)
                console.log('current treasurer id: ', cur_treasurer_id)
                doc.members.push(cur_treasurer_id);
                console.log('add cur treasurer id:', doc.members)

                doc.save().then(() => {
                    io.emit('promoted-to-treasurer', user)
                });
            })
        })
    })
}