const FundHistory = require('../models/FundHistory')
const Club = require('../models/Club')
const cloudinary = require('../helper/Cloudinary')
const fs = require('fs');
const Buffer = require('buffer').Buffer

module.exports.create = async (req, res) => {
    const files = req.files;
    const { club, author, type, total, content } = req.body;
    let file_url = '';
    let cloudinary_id = '';

    if (files.length > 0) {
        const { path } = files[0]

        const newPath = await cloudinary.uploader.upload(path, {
            resource_type: 'auto',
            folder: 'Club-Management/Files'
        }).catch(error => {
            console.log(error)
            res.status(400).json({
                file: error.message
            })
        })
        fs.unlinkSync(path)
        file_url = newPath.url;
        cloudinary_id = newPath.public_id;
    }

    let fundHistory = new FundHistory({
        club, author, type, total, content, file_url, cloudinary_id
    })

    Club.findById(club, function (err, doc) {
        if (err) {
            res.status(400).json({ error: err.message })
            return;
        }

        if (type === 'Thu') {
            doc.fund = doc.fund + Number(total);
        } else {
            doc.fund = doc.fund - Number(total);
        }

        doc.save().then(club => {
            fundHistory.save().then(fh => {
                fh.populate('author')
                    .execPopulate().then(result => {
                        res.status(201).send({ fundHistory: result, fund: club.fund })
                    })
            }).catch(err => {
                res.status(400).json({ error: err.message })
            })
        }).catch(err => {
            res.status(400).json({ error: err.message })
        })
    })
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

module.exports.search = (req, res) => {
    const clubId = req.params.clubId;
    const encodedSearchValue = req.params.searchValue;
    const buff = Buffer.from(encodedSearchValue, "base64");
    const searchValue = buff.toString("utf8");

    FundHistory.find({
        $and: [
            { club: clubId },
            {
                $or: [
                    { content: { $regex: searchValue } },
                ]
            }
        ]
    }).populate('author')
        .then(result => {
            res.status(200).send(result)
        }).catch(err => {
            res.status(500).json({ error: err.message })
        })
}