const Group = require('../models/Group')

module.exports = function (socket, io) {
    socket.on('get-groups', club_id => {
        Group.find({ club: club_id })
            .populate('members')
            .then(result => {
                io.emit('output-groups', result)
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

    socket.on('delete-group', group_id => {
        Group.findByIdAndDelete(group_id).then(result => {
            console.log(result)
            io.emit('group-deleted', result)
        })
    })
}