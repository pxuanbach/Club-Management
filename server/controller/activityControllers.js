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
    const { boards } = req.body

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