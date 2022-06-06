const Group = require('../models/Group')
const Club = require('../models/Club')
const User = require('../models/User')
const { ConvertUsers } = require('../helper/ConvertDataHelper')
const Buffer = require('buffer').Buffer

function userExists(arr, id) {
    return arr.some(function (el) {
        return el._id === id;
    });
}

module.exports.create = (req, res) => {
    const { clubId, name, members } = req.body

    let group = new Group({ club: clubId, name, members })

    group.save().then(gr => {
        gr.populate('members')
            .execPopulate()
            .then(result => {
                res.status(201).send(result)
            }).catch(err => {
                res.status(400).send({ error: err.message })
            })
    }).catch(err => {
        res.status(400).send({ error: err.message })
    })
}

module.exports.addMembers = (req, res) => {
    const { groupId, users } = req.body;

    Group.findById(groupId, function (err, doc) {
        if (err) {
            res.status(400).send({ error: err.message })
            return;
        }

        users.forEach(user => {
            doc.members.push(user)
        });

        doc.save().then(gr => {
            //console.log(gr)
            gr.populate('members')
                .execPopulate()
                .then(result => {
                    res.status(201).send(result)
                }).catch(err => {
                    res.status(400).send({ error: err.message })
                })
        }).catch(err => {
            res.status(400).send({ error: err.message })
        })
    }).catch(err => {
        res.status(400).send({ error: err.message })
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

module.exports.getOne = (req, res) => {
    const groupId = req.params.groupId;

    Group.findById(groupId)
        .populate('members')
        .then(result => {
            res.status(200).send(result)
        }).catch(err => {
            res.status(500).json({ error: err.message })
        })
}


module.exports.searchGroupInClub = (req, res) => {
    const clubId = req.params.clubId;
    const encodedSearchValue = req.params.searchValue;
    const buff = Buffer.from(encodedSearchValue, "base64");
    const searchValue = buff.toString("utf8");

    Group.find({
        $and: [
            { club: clubId },
            { name: { $regex: searchValue } }
        ]
    }).sort({ name: 1 })
        .populate('members')
        .then(grs => {
            res.status(200).send(grs)
        }).catch(err => {
            res.status(500).json({ error: err.message })
        })
}

module.exports.getAllMembers = (req, res) => {
    const clubId = req.params.clubId;

    Club.findById(clubId).then(club => {
        let arrId = club.members
        arrId.push(club.leader)
        arrId.push(club.treasurer)
        //console.log(arrId)
        User.find({
            _id: {
                $in: arrId
            }
        }).then(users => {
            res.status(200).send(users)
        }).catch(err => {
            res.status(500).json({ error: err.message })
        })
    }).catch(err => {
        res.status(500).json({ error: err.message })
    })
}

module.exports.getAllNotInGroup = async (req, res) => {
    const groupId = req.params.groupId;

    try {
        const group = await Group.findById(groupId)
        const club = await Club.findById(group.club)
        let arrId = club.members
        arrId.push(club.leader)
        arrId.push(club.treasurer)

        const listUser = await User.find({
            $and: [
                { _id: { $in: arrId } },
                { _id: { $nin: group.members } }
            ]
        })

        if (listUser) {
            res.status(200).send(listUser)
        } else {
            res.status(500).json({ error: 'load list user failed' })
        }
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

module.exports.searchAllNotInGroup = async (req, res) => {
    const groupId = req.params.groupId;
    const encodedSearchValue = req.params.searchValue;
    const buff = Buffer.from(encodedSearchValue, "base64");
    const searchValue = buff.toString("utf8");

    try {
        const group = await Group.findById(groupId)
        const club = await Club.findById(group.club)
        let arrId = club.members
        arrId.push(club.leader)
        arrId.push(club.treasurer)

        const listUser = await User.find({
            $and: [
                { _id: { $in: arrId } },
                { _id: { $nin: group.members } },
                { username: { $nin: ['admin', 'admin0'] } },
                {
                    $or: [
                        { username: { $regex: searchValue } },
                        { name: { $regex: searchValue } },
                        { email: { $regex: searchValue } }
                    ]
                }
            ]
        })

        if (listUser) {
            res.status(200).send(listUser)
        } else {
            res.status(500).json({ error: 'load list user failed' })
        }
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

module.exports.searchAll = (req, res) => {
    const clubId = req.params.clubId;
    const encodedSearchValue = req.params.searchValue;
    const buff = Buffer.from(encodedSearchValue, "base64");
    const searchValue = buff.toString("utf8");

    Club.findById(clubId).then(club => {
        let arrId = club.members
        arrId.push(club.leader)
        arrId.push(club.treasurer)
        //console.log(arrId)
        User.find({
            $and: [
                { _id: { $in: arrId } },
                {
                    $or: [
                        { username: { $regex: searchValue } },
                        { name: { $regex: searchValue } },
                        { email: { $regex: searchValue } }
                    ]
                }
            ]
        }).then(users => {
            res.status(200).send(users)
        }).catch(err => {
            res.status(500).json({ error: err.message })
        })
    }).catch(err => {
        res.status(500).json({ error: err.message })
    })
}

module.exports.update = (req, res) => {
    const groupId = req.params.groupId;
    const { newName, membersRemove } = req.body;

    Group.updateOne(
        { _id: groupId },
        {
            $set: { name: newName },
            $pull: { members: { $in: membersRemove } },
        }
    ).then(() => {
        Group.findById(groupId)
        .populate('members')
        .then(result => {
            res.status(200).send(result)
        }).catch(err => {
            res.status(400).send({ error: err.message })
        })
    }).catch(err => {
        res.status(400).send({ error: err.message })
    })
}

module.exports.delete = (req, res) => {
    const groupId = req.params.groupId;

    Group.findByIdAndDelete(groupId)
    .then(() => {
        res.status(200).send(groupId)
    }).catch(err => {
        res.status(500).send({ error: err.message })
    })
}