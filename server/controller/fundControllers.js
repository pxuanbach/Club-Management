const FundHistory = require('../models/FundHistory')

module.exports = function (socket, io) {
    socket.on('get-fundHistory', (club_id) => {
        FundHistory.find({club: club_id})
        .populate('club')
        .populate('author')
        .then(result => {
            io.emit('output-fundHistory', result)
        })
    })

    socket.on('create-fundHistory',
        (club_id, author_id, type, total, content, cloudinary_id, file_url) => {
            let fundHistory = new  FundHistory({
                club: club_id,
                author: author_id,
                type,
                total,
                content,
                file_url,
                cloudinary_id
            })

            fundHistory.save().then(fh => {
                fh.populate('club')
                .populate('author')
                .execPopulate().then(result => {
                    console.log(result)
                    io.emit('fundHistory-created', result)
                })
            })
        })
}