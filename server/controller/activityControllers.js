const Activity = require('../models/Activity')
const ActivityCard = require('../models/ActivityCard')
const async = require('async')

module.exports = function (socket, io) {
    socket.on('create-activity', (club_id, content, startDate, endDate) => {
        const activity = new Activity({
            club: club_id,
            content,
            startDate,
            endDate
        });

        activity.save().then(result => {
            io.emit('activity-created', result)
        })
    })
}

module.exports.create = (req, res) => {
    const { club, content, startDate, endDate } = req.body

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
        content,
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
    const {} = req.body
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

    Activity.findById(activityId, async function(err, doc) {
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