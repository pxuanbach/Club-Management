const Activity = require('../models/Activity')

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
    const {club, content, startDate, endDate} = req.body

    const activity = new Activity({
        club,
        content,
        startDate,
        endDate
    });

    activity.save().then(result => {
        res.status(201).send(result)
    }).catch(err => {
        res.status(400).json({ error: err.message })
    })
}

module.exports.getList = (req, res) => {
    const clubId = req.params.clubId;

    Activity.find({club: clubId}).then(result => {
        res.status(200).send(result)
    }).catch(err => {
        res.status(500).send({ error: err.message })
    })
}