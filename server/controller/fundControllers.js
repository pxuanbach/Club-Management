const FundHistory = require('../models/FundHistory')
const Club = require('../models/Club')

module.exports = function (socket, io) {
    socket.on('get-fundHistory', (club_id) => {
        FundHistory.find({ club: club_id })
            .populate('author')
            .then(result => {
                io.emit('output-fundHistory', result)
            })
    })

    socket.on('create-fundHistory',
        (club_id, author_id, type, total, content, cloudinary_id, file_url) => {
            let fundHistory = new FundHistory({
                club: club_id,
                author: author_id,
                type,
                total,
                content,
                file_url,
                cloudinary_id
            })
            Club.findById(club_id, function (err, doc) {
                if (err) return;

                if (type === 'Thu') {
                    doc.fund = doc.fund + Number(total);
                } else {
                    doc.fund = doc.fund - Number(total);
                }

                doc.save().then(club => {
                    fundHistory.save().then(fh => {
                        fh.populate('author')
                            .execPopulate().then(result => {
                                io.emit('fundHistory-created', result, club.fund)
                            })
                    })

                });
            })

        })
}