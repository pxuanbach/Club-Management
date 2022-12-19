const FundHistory = require('../models/FundHistory')
const Club = require('../models/Club')
const Point = require('../models/Point')
const cloudinary = require('../helper/Cloudinary')
const fs = require('fs');
const Buffer = require('buffer').Buffer
const moment = require('moment')

module.exports.getFundHistories = async (
    clubId, startDate, endDate, applyFilter, search = '', type = ''
) => {
    let startDateValue = startDate
    let endDateValue = endDate
    if (applyFilter === "false") {
        let filterQuery =  {
            club: clubId,
            content: { $regex: search ? search : '' },
        }
        if (type !== '') {
            filterQuery = {...filterQuery, type: type}
        }
        const funds = await FundHistory.find(filterQuery)
            .populate('author')
            .sort({ createdAt: -1 })
        let collect = 0;
        let pay = 0;
        funds.forEach((fh) => {
            if (fh.type === "Thu" || fh.type === "Thu mỗi tháng") {
                collect += fh.total
            } else {
                pay += fh.total
            }
        })
        // console.log(funds)
        return {
            collect,
            pay,
            funds
        };
    }
    if (startDate === undefined) {
        startDateValue = moment().startOf('month')
    }
    if (endDate === undefined) {
        endDateValue = moment().endOf('month')
    }
    let filterQuery =  {
        club: clubId,
        content: { $regex: search ? search : '' },
        createdAt: {
            $gte: new Date(startDateValue),
            $lte: new Date(endDateValue)
        },
    }
    if (type !== '') {
        filterQuery = {...filterQuery, type: type}
    }
    const funds = await FundHistory.find(filterQuery).populate('author').sort({ createdAt: -1 })
    let collect = 0;
    let pay = 0;
    funds.forEach((fh) => {
        if (fh.type === "Thu" || fh.type === "Thu mỗi tháng") {
            collect += fh.total
        } else {
            pay += fh.total
        }
    })
    return {
        collect,
        pay,
        funds
    };
}

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

module.exports.getList = async (req, res) => {
    const clubId = req.params.clubId;
    const { startDate, endDate, applyFilter, search } = req.query
    try {
        result = await this.getFundHistories(
            clubId, startDate, endDate, applyFilter, search
        )
        res.send(result)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

module.exports.getMonthlyFunds = async (req, res) => {
    const clubId = req.params.clubId;
    const { startDate, endDate, applyFilter, search } = req.query
    try {
        result = await this.getFundHistories(
            clubId, startDate, endDate, applyFilter, search, "Thu mỗi tháng"
        )
        res.send(result)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

module.exports.getMonthlyFund = async (req, res) => {
    const clubId = req.params.clubId;
    const { startDate, endDate } = req.query
    try {
        let startDateValue = startDate
        let endDateValue = endDate
        if (startDate === undefined) {
            startDateValue = moment().startOf('month')
        }
        if (endDate === undefined) {
            endDateValue = moment().endOf('month')
        }
        let filterQuery =  {
            club: clubId,
            type: "Thu mỗi tháng",
            createdAt: {
                $gte: new Date(startDateValue),
                $lte: new Date(endDateValue)
            },
        }
        const fund = await FundHistory.findOne(filterQuery).populate("submitted.member_id")
        res.status(200).send(fund)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
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

module.exports.getFundHistoryById = async (req, res) => {
    const fundId = req.params.fundId;
    try {
        const fund = await FundHistory.findById(fundId).populate("submitted.member_id")
        if (fund === undefined || fund === null) {
            res.status(404).send({ error: `Không tìm thấy quỹ này` })
        }
        res.send(fund)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

module.exports.updateSubmitted = async (req, res) => {
    const clubId = req.params.clubId;
    const {submittedList} = req.body
    const startDate = moment().startOf('month')
    const endDate = moment().endOf('month')
    try {
        let filterQuery =  {
            club: clubId,
            type: "Thu mỗi tháng",
            createdAt: {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            },
        }
        let fund = await FundHistory.findOne(filterQuery).populate('club');
        if (fund === undefined || fund === null) {
            res.status(404).send({ error: `Không tìm thấy quỹ tháng ${startDate.format("MM/YYYY")}.` })
        }
        total = 0
        const validSubmittedList = submittedList.map(async (sub) => {
            total = total + sub.total;
            return {
                total: sub.total,
                member_id: sub.member_id._id
            }
        })
        fund.submitted = validSubmittedList
        fund.total = total
        const savedFund = await fund.save()
        const result = await savedFund
            .populate("submitted.member_id")
            .execPopulate();
        res.send(result)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}