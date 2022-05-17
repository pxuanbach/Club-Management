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