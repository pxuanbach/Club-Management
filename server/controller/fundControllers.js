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

    socket.on('get-col-pay-in-month', (club_id) => {
        let date = new Date();
        firstDay = new Date(date.getFullYear(), date.getMonth(), 1)
        lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0)

        FundHistory.find({
            $and: [
                { club: club_id },
                {
                    createdAt: {
                        $gt: firstDay,
                        $lte: lastDay
                    }
                }
            ]
        })
            .then(result => {
                let collect = 0;
                let pay = 0;
                result.forEach((fh) => {
                    if (fh.type === "Thu") {
                        collect += fh.total
                    } else {
                        pay += fh.total
                    }
                })
                //console.log(result, collect, pay, firstDay, lastDay)
                io.emit('output-col-pay-in-month', collect, pay)
            })
    })

    socket.on('search-fundHistory', (club_id, search) => {
        FundHistory.find({
            $and: [
                { club: club_id },
                {
                    $or: [
                        { content: { $regex: search } },
                    ]
                }
            ]
        }).populate('author')
            .then(result => {
                io.emit('fundHistory-searched', result)
            })
    })
}

module.exports.create = (req, res) => {

}

module.exports.getList = (req, res) => {
    const clubId = req.params.clubId;

    FundHistory.find({ club: clubId })
        .populate('author')
        .then(result => {
            res.status(200).send(result)
        }).catch(err => {
            res.status(500).json({ error: err.message })
        })
}

module.exports.getColPayInMonth = (req, res) => {
    const clubId = req.params.clubId;
    const date = new Date();
    firstDay = new Date(date.getFullYear(), date.getMonth(), 1)
    lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0)

    FundHistory.find({
        $and: [
            { club: clubId },
            {
                createdAt: {
                    $gt: firstDay,
                    $lte: lastDay
                }
            }
        ]
    }).then(result => {
        let collect = 0;
        let pay = 0;
        result.forEach((fh) => {
            if (fh.type === "Thu") {
                collect += fh.total
            } else {
                pay += fh.total
            }
        })
        res.status(200).send({ collect, pay })
    }).catch(err => {
        res.status(500).json({ error: err.message })
    })
}