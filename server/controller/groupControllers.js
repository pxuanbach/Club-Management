const Group = require('../models/Group')
const Club = require('../models/Club')
const User = require('../models/User')
const { ConvertUsers } = require('../helper/ConvertDataHelper')

function userExists(arr, id) {
    return arr.some(function (el) {
        return el._id === id;
    });
}

module.exports = function (socket, io) {
    socket.on('get-groups', club_id => {
        Group.find({ club: club_id })
            .sort({ name: 1 })
            .populate('members')
            .then(result => {
                io.emit('output-groups', result)
            })
    })

    socket.on('get-members-not-in-group', (club_id, members) => {
        //console.log(members)
        Club.findById(club_id).then(club => {
            let arrId = club.members
            if (!userExists(members, club.leader._id)) {
                arrId.push(club.leader._id)
            }
            if (!userExists(members, club.treasurer._id)) {
                arrId.push(club.treasurer._id)
            }

            arrId = arrId.filter(el => {
                return !members.find(obj => {
                    return el === obj._id;
                })
            })

            User.find({
                _id: {
                    $in: arrId
                }
            }).then(users => {
                io.emit('output-members-not-in-group', ConvertUsers(users));
            })
        })
    })

    socket.on('create-group', ({ club_id, name, members }) => {
        let group = new Group({ club: club_id, name, members })

        group.save().then(gr => {
            gr.populate('members')
                .execPopulate()
                .then(result => {
                    io.emit('group-created', result)
                })
        })
    })

    socket.on('delete-group', (group_id, callback) => {
        Group.findByIdAndDelete(group_id).then(result => {
            console.log(result)
            io.emit('group-deleted', result)
            callback()
        })
    })

    socket.on('delete-member-from-group', (group_id, member_id) => {
        Group.findById(group_id, function (err, doc) {
            if (err) return;
            let newMembers = doc.members.filter(member => member.toString() !== member_id)
            doc.members = newMembers;
            //console.log(newMembers)
            doc.save().then(gr => {
                gr.populate('members')
                    .execPopulate()
                    .then(result => {
                        io.emit('deleted-member-from-group', result)
                    })
            })
        })
    })

    socket.on('update-group', ({ group_id, name, members }) => {
        Group.findById(group_id, function (err, doc) {
            if (err) return;
            doc.name = name;

            members.forEach(elm => {
                doc.members.push(elm._id)
            });
            //console.log(doc.members)

            doc.save().then(gr => {
                //console.log(gr)
                gr.populate('members')
                    .execPopulate()
                    .then(result => {
                        io.emit('group-updated', result)
                    })
            })
        })
    })

    socket.on('search-groups', (club_id, search) => {
        Group.find({
            $and: [
                { club: club_id },
                { name: { $regex: search } }
            ]
        }).sort({ name: 1 })
            .populate('members')
            .then(grs => {
                io.emit('groups-searched', grs)
            })
    })
}

module.exports.getList = (req, res) => {
    const clubId = req.params.clubId

    Group.find({ club: clubId })
    .sort({ name: 1 })
    .populate('members')
    .then(result => {
        res.status(200).send(result)
    }).catch(err => {
        res.status(500).json({ error: err.message })
    })
}