const Activity = require('../models/Activity')
const ActivityCard = require('../models/ActivityCard')
const async = require('async')
const Buffer = require('buffer').Buffer

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

module.exports.update = (req, res) => {
    const activityId = req.params.activityId;
    const { title, startDate, endDate } = req.body;

    Activity.updateOne(
        {_id: activityId},
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

module.exports.delete = (req, res) => {
    const activityId = req.params.activityId;

    Activity.findByIdAndDelete(activityId, function(err, doc) {
        if (err) {
            res.status(500).send({ error: "Load activity err - " + err.message })
            return;
        }

        async.forEach(doc.boards, function (item, callback) {
            ActivityCard.deleteMany({_id: {$in: item.cards}})
            .then(() => {
                callback();
            }).catch(err => {
                res.status(500).send({ error: "Card delete err - " + err.message })
            })
        }, function (err) {
            if (err) {
                res.status(500).send({ error: "Card deleted err - " + err.message })
                return;
            }
            res.status(200).send(doc)
        })
    })
}