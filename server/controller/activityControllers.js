const Activity = require('../models/Activity')
const ActivityCard = require('../models/ActivityCard')
const User = require('../models/User')
const cloudinary = require('../helper/Cloudinary')
const fs = require('fs');
const async = require('async')
const Buffer = require('buffer').Buffer
const { isElementInArray, isElementInArrayObject } = require('../helper/ArrayHelper')

function isUserJoined(userId, card) {
    if (isElementInArray(userId, card.userJoin)) {
        return true;
    }

    card.groupJoin.forEach(group => {
        if (isElementInArray(userId, group.members)) {
            return true;
        }
    })

    return false;
}

function isGroupJoined(groupId, card) {
    if (isElementInArrayObject(groupId, card.groupJoin)) {
        return true;
    }
    return false;
}

async function uploadFile(files, public_id) {
    if (files.length > 0) {
        const { path } = files[0]

        const newPath = await cloudinary.uploader.upload(path, {
            resource_type: 'auto',
            folder: 'Club-Management/Activity'
        }).catch(error => {
            console.log(error)
            return {
                original_filename: '',
                url: '',
                public_id: '',
            }
        })
        fs.unlinkSync(path)
        if (public_id !== '') {
            await cloudinary.uploader.destroy(public_id, function (result) {
                console.log("destroy image", result);
            }).catch(err => {
                console.log("destroy image err ", err.message)
            })
        }
        //console.log("upload function", newPath)
        return {
            original_filename: newPath.original_filename,
            url: newPath.url,
            public_id: newPath.public_id
        }
    }
    return {
        original_filename: '',
        url: '',
        public_id: '',
    }
}

module.exports.create = (req, res) => {
    const { club, title, startDate, endDate } = req.body

    let boards = [
        {
            title: "Cần làm",
            cards: []
        },
        {
            title: "Đang làm",
            cards: []
        },
        {
            title: "Đã xong",
            cards: []
        },
        {
            title: "Ghi chú",
            cards: []
        }
    ]

    const activity = new Activity({
        club,
        title,
        startDate,
        endDate,
        boards
    });

    activity.save().then(result => {
        res.status(201).send(result)
    }).catch(err => {
        res.status(400).json({ error: err.message })
    })
}

module.exports.createCard = (req, res) => {
    const { activityId, columnId, title } = req.body

    const card = new ActivityCard({
        activity: activityId,
        title
    })

    card.save().then(newCard => {
        Activity.findById(activityId, function (err, doc) {
            if (err) {
                res.status(500).send({ error: "Activity load err - " + err.message })
                return;
            }

            doc.boards.forEach(col => {
                if (col._id.toString() === columnId) {
                    col.cards.push(newCard._id)
                }
            })

            doc.save().then(result => {
                async.forEach(result.boards, function (item, callback) {
                    ActivityCard.populate(item, { "path": "cards" }, function (err, output) {
                        if (err) {
                            res.status(500).send({ error: "Populate err - " + err.message })
                            return;
                        }
                        callback();
                    })
                }, function (err) {
                    if (err) {
                        res.status(500).send({ error: "Populate complete err - " + err.message })
                        return;
                    }
                    res.status(200).send(result)
                })
            }).catch(err => {
                res.status(500).send({ error: "Save err - " + err.message })
            })
        })
    }).catch(err => {
        res.status(400).json({ error: "Save err - " + err.message })
    })
}

module.exports.userJoin = (req, res) => {
    const { userId, cardId } = req.body

    ActivityCard.findById(cardId)
        .populate('groupJoin')
        .then(card => {
            //check user joined?
            if (isUserJoined(userId, card)) {
                res.status(200).send({ message: "Bạn đã tham gia", success: false })
            } else {
                ActivityCard.updateOne(
                    { _id: cardId },
                    { $push: { userJoin: userId } }
                ).then(() => {
                    res.status(200).send({ message: "Tham gia thành công!", success: true })
                }).catch(err => {
                    res.status(500).json({ error: "Update card err - " + err.message })
                })
            }
        }).catch(err => {
            res.status(500).json({ error: "Query card err - " + err.message })
        })
}

module.exports.groupJoin = (req, res) => {
    const { groupId, cardId } = req.body;

    ActivityCard.findById(cardId)
        .populate('groupJoin')
        .then(card => {
            if (isGroupJoined(groupId, card)) {
                res.status(200).send({ message: "Nhóm đã tham gia", success: false })
            } else {
                ActivityCard.updateOne(
                    { _id: cardId },
                    { $push: { groupJoin: groupId } }
                ).then(() => {
                    res.status(200).send({ message: "Nhóm tham gia thành công!", success: true })
                }).catch(err => {
                    res.status(500).json({ error: "Update card err - " + err.message })
                })
            }
        }).catch(err => {
            res.status(500).json({ error: "Query card err - " + err.message })
        })
}

module.exports.getList = (req, res) => {
    const clubId = req.params.clubId;

    Activity.find({ club: clubId })
        .then(result => {
            res.status(200).send(result)
        }).catch(err => {
            res.status(500).send({ error: err.message })
        })
}

module.exports.getOne = (req, res) => {
    const activityId = req.params.activityId;

    Activity.findById(activityId)
        .populate('club')
        .then(result => {
            async.forEach(result.boards, function (item, callback) {
                ActivityCard.populate(item, { "path": "cards" }, function (err, output) {
                    if (err) {
                        res.status(500).send({ error: err.message })
                        return;
                    }
                    callback();
                })
            }, function (err) {
                if (err) {
                    res.status(500).send({ error: err.message })
                    return;
                }
                res.status(200).send(result)
            })
        }).catch(err => {
            res.status(500).send({ error: err.message })
        })
}

module.exports.getCollaborators = (req, res) => {
    const activityId = req.params.activityId

    Activity.findById(activityId)
        .populate('collaborators')
        .then(result => {
            res.status(200).send(result.collaborators)
        }).catch(err => {
            res.status(500).send({ error: err.message })
        })
}

module.exports.getUsersNotCollaborators = (req, res) => {
    const activityId = req.params.activityId

    Activity.findById(activityId)
        .populate('club')
        .then(result => {
            User.find({
                $and: [
                    { _id: { $nin: result.club.members } },
                    { _id: { $nin: result.collaborators } },
                    { _id: { $nin: [result.club.leader, result.club.treasurer] } },
                    { username: { $nin: ['admin', 'admin0'] } },
                ]
            }).limit(20)
                .then(users => {
                    res.status(200).send(users)
                }).catch(err => {
                    console.log(err)
                    res.status(500).send({ error: err.message })
                })

        }).catch(err => {
            res.status(500).send({ error: err.message })
        })
}

module.exports.search = (req, res) => {
    const clubId = req.params.clubId;
    const encodedSearchValue = req.params.searchValue;
    const buff = Buffer.from(encodedSearchValue, "base64");
    const searchValue = buff.toString("utf8");

    Activity.find({
        $and: [
            { club: clubId },
            { title: { $regex: searchValue } }
        ]
    }).then(result => {
        res.status(200).send(result)
    }).catch(err => {
        res.status(500).send({ error: err.message })
    })
}

module.exports.searchCollaborators = (req, res) => {
    const activityId = req.params.activityId;
    const encodedSearchValue = req.params.searchValue;
    const buff = Buffer.from(encodedSearchValue, "base64");
    const searchValue = buff.toString("utf8");

    Activity.findById(activityId)
        .then(result => {
            User.find({
                $and: [
                    { _id: { $in: result.collaborators } },
                    { username: { $nin: ['admin', 'admin0'] } },
                    {
                        $or: [
                            { username: { $regex: searchValue } },
                            { name: { $regex: searchValue } },
                            { email: { $regex: searchValue } }
                        ]
                    }
                ]
            }).then(collaborators => {
                res.status(200).send(collaborators)
            }).catch(err => {
                res.status(500).send({ error: "User query err - " + err.message })
            })
        }).catch(err => {
            res.status(500).send({ error: "Activity query err - " + err.message })
        })
}

module.exports.searchUsersNotCollaborators = (req, res) => {
    const activityId = req.params.activityId;
    const encodedSearchValue = req.params.searchValue;
    const buff = Buffer.from(encodedSearchValue, "base64");
    const searchValue = buff.toString("utf8");

    Activity.findById(activityId)
        .populate('club')
        .then(result => {
            User.find({
                $and: [
                    { _id: { $nin: result.club.members } },
                    { _id: { $nin: result.collaborators } },
                    { _id: { $nin: [result.club.leader, result.club.treasurer] } },
                    { username: { $nin: ['admin', 'admin0'] } },
                    {
                        $or: [
                            { username: { $regex: searchValue } },
                            { name: { $regex: searchValue } },
                            { email: { $regex: searchValue } }
                        ]
                    }
                ]
            }).limit(20)
                .then(users => {
                    res.status(200).send(users)
                }).catch(err => {
                    console.log(err)
                    res.status(500).send({ error: err.message })
                })

        }).catch(err => {
            res.status(500).send({ error: err.message })
        })
}

module.exports.update = (req, res) => {
    const activityId = req.params.activityId;
    const { title, startDate, endDate } = req.body;

    Activity.updateOne(
        { _id: activityId },
        {
            title,
            startDate,
            endDate
        }
    ).then(() => {
        Activity.findById(activityId).then(result => {
            res.status(200).send(result)
        }).catch(err => {
            res.status(500).send({ error: "Activity result err - " + err.message })
        })
    }).catch(err => {
        res.status(500).send({ error: "Activity update err - " + err.message })
    })
}

module.exports.updateBoards = (req, res) => {
    const activityId = req.params.activityId;
    const { boards } = req.body;

    Activity.updateOne({ _id: activityId }, { boards })
        .then(() => {
            Activity.findById(activityId).then(result => {
                async.forEach(result.boards, function (item, callback) {
                    ActivityCard.populate(item, { "path": "cards" }, function (err, output) {
                        if (err) {
                            res.status(500).send({ error: err.message })
                            return;
                        }
                        callback();
                    })
                }, function (err) {
                    if (err) {
                        res.status(500).send({ error: err.message })
                        return;
                    }
                    res.status(200).send(result)
                })
            })
        }).catch(err => {
            res.status(400).json({ error: err.message })
        })

}

module.exports.updateColumn = async (req, res) => {
    const activityId = req.params.activityId;
    const { column, card } = req.body;
    //console.log(column, typeof card)

    Activity.findById(activityId, async function (err, doc) {
        if (err) {
            res.status(500).send({ error: "Loading err - " + err.message })
            return;
        }

        if (card === null) {
            for (let i = 0; i < doc.boards.length; i++) {
                if (doc.boards[i]._id.toString() === column._id) {
                    doc.boards[i].cards = column.cards;
                }
            }
        } else {
            doc.boards.forEach(col => {
                if (col._id.toString() === column._id) {
                    col.cards = column.cards;
                } else {
                    var newCards = col.cards.filter(function (value, index, arr) {
                        return value._id.toString() !== card._id;
                    })
                    col.cards = newCards;
                }
            })
        }

        doc.save().then(result => {
            async.forEach(result.boards, function (item, callback) {
                ActivityCard.populate(item, { "path": "cards" }, function (err, output) {
                    if (err) {
                        res.status(500).send({ error: "Populate err - " + err.message })
                        return;
                    }
                    callback();
                })
            }, function (err) {
                if (err) {
                    res.status(500).send({ error: "Populate complete err - " + err.message })
                    return;
                }
                res.status(200).send(result)
            })
        }).catch(err => {
            res.status(500).send({ error: "Save err - " + err.message })
        })
    })
}

module.exports.updateCollaborators = (req, res) => {
    const activityId = req.params.activityId;
    const { collaborators } = req.body;

    Activity.updateOne(
        { _id: activityId },
        { $pull: { collaborators: { $in: collaborators } } }
    ).then(() => {
        res.status(200).send()
    }).catch(err => {
        res.status(500).send({ error: "Activity update err - " + err.message })
    })
}

module.exports.addCollaborators = (req, res) => {
    const activityId = req.params.activityId;
    const { users } = req.body;

    Activity.updateOne(
        { _id: activityId },
        { $push: { collaborators: { $each: users } } }
    ).then(() => {
        res.status(200).send()
    }).catch(err => {
        res.status(500).send({ error: "Activity update err - " + err.message })
    })
}

module.exports.deleteAllCards = async (req, res) => {
    try {
        const activityId = req.params.activityId;
        const { columnId } = req.body;

        let activity = await Activity.findById(activityId)
        let listCardId = []
        activity.boards.forEach(column => {
            if (column._id.toString() === columnId) {
                listCardId = JSON.parse(JSON.stringify(column.cards))
                column.cards = []
            }
        })

        async.forEach(listCardId, async function (item, callback) {
            let card = await ActivityCard.findById(item);

            card.remove().then(() => {
                if (typeof callback === 'function') {
                    return callback()
                }
            })
        }, function (err) {
            if (err) {
                res.status(500).send({ error: "Card deleted err - " + err.message })
                return;
            }
            activity.save().then(result => {
                async.forEach(result.boards, function (item, callback) {
                    ActivityCard.populate(item, { "path": "cards" }, function (err, output) {
                        if (err) {
                            res.status(500).send({ error: err.message })
                            return;
                        }
                        callback();
                    })
                }, function (err) {
                    if (err) {
                        res.status(500).send({ error: err.message })
                        return;
                    }
                    res.status(200).send(result)
                })
            })
        })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

module.exports.delete = async (req, res) => {
    try {
        const activityId = req.params.activityId;
        let activity = await Activity.findById(activityId);
        const boards = activity.boards;
        const mergeCards = boards[0].cards.concat(boards[1].cards, boards[2].cards, boards[3].cards)
        //console.log(mergeCards)
        async.forEach(mergeCards, async function (item, callback) {
            let card = await ActivityCard.findById(item);

            card.remove().then(() => {
                if (typeof callback === 'function') {
                    return callback()
                }
            })
        }, function (err) {
            if (err) {
                res.status(500).send({ error: "Card deleted err - " + err.message })
                return;
            }
            activity.remove().then(() => {
                res.status(200).send(activity)
            })
        })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

//card
module.exports.upload = async (req, res) => {
    const files = req.files;
    const { cardId } = req.body;

    const uploadData = await uploadFile(files, '');
    //console.log(uploadData)
    ActivityCard.updateOne(
        { _id: cardId },
        { $push: { files: uploadData } }
    ).then(() => {
        ActivityCard.findById(cardId).then(result => {
            res.status(200).send(result)
        }).catch(err => {
            res.status(500).json({ error: "Result err - " + err.message })
        })
    }).catch(err => {
        res.status(500).json({ error: "Update card err - " + err.message })
    })
}

module.exports.addComment = async (req, res) => {
    try {
        const { cardId, content, author } = req.body;
        let now = Date.now();
        //console.log(cardId, content, author)

        let card = await ActivityCard.findById(cardId);
        const comment = {
            content,
            createdAt: now,
            author
        }

        card.comments.push(comment)

        card.save().then(result => {
            res.status(200).send(result)
        })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }

}

module.exports.getCard = (req, res) => {
    const cardId = req.params.cardId;

    ActivityCard.findById(cardId)
        .populate('userJoin')
        .populate('groupJoin')
        .then(result => {
            async.forEach(result.comments, function (item, callback) {
                User.populate(item, { "path": "author" }, function (err, output) {
                    if (err) {
                        res.status(500).send({ error: err.message })
                        return;
                    }
                    callback();
                })
            }, function (err) {
                if (err) {
                    res.status(500).send({ error: err.message })
                    return;
                }
                res.status(200).send(result)
            })
        }).catch(err => {
            res.status(500).send({ error: err.message })
        })
}

module.exports.updateCardDescription = (req, res) => {
    const cardId = req.params.cardId;
    const { description } = req.body;

    ActivityCard.updateOne(
        { _id: cardId },
        { description }
    ).then(() => {
        ActivityCard.findById(cardId).then(result => {
            res.status(200).send(result)
        }).catch(err => {
            res.status(500).json({ error: "Result err - " + err.message })
        })
    }).catch(err => {
        res.status(500).json({ error: "Update card err - " + err.message })
    })
}

module.exports.deleteComment = async (req, res) => {
    try {
        const cardId = req.params.cardId;
        const { commentId } = req.body;
        let card = await ActivityCard.findById(cardId)

        const newComments = card.comments
            .filter(comment => comment._id.toString() !== commentId)

        card.comments = newComments;

        card.save().then(result => {
            res.status(200).send(result)
        })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

module.exports.deleteFile = async (req, res) => {
    try {
        const cardId = req.params.cardId;
        const {public_id} = req.body;
        await cloudinary.uploader.destroy(public_id, function (result) {
            console.log("destroy image", result);
        })

        let card = await ActivityCard.findById(cardId)

        const newFiles = card.files.filter(file => file.public_id !== public_id)

        card.files = newFiles;

        card.save().then(result => {
            res.status(200).send(result)
        })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

module.exports.deleteCard = async (req, res) => {
    try {
        const cardId = req.params.cardId;
        let card = await ActivityCard.findById(cardId)

        Activity.findById(card.activity, function (error, activity) {
            if (error) {
                res.status(500).json({ error: error.message })
            }
            activity.boards.forEach(column => {
                if (isElementInArray(card._id, column.cards)) {
                    var newCards = column.cards.filter(c => c.toString() !== card._id.toString())
                    column.cards = newCards
                }
            })
            activity.save()
                .then(() => {
                    card.remove().then(() => {
                        res.status(200).send({ message: "remove success", data: card })
                    })
                })
        })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}