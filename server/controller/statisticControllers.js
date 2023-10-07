const Club = require('../models/Club');
const FundHistory = require('../models/FundHistory');
const ClubLog = require('../models/ClubLog');
const moment = require('moment');
const mongoose = require('mongoose');


module.exports.statisticMemberJoinOfClub = async (req, res) => {
    const clubId = req.params.clubId;
    const { selectOption } = req.query
    let timeFormat = "YYYY-MM-DD"
    if (selectOption !== undefined) {
        timeFormat = selectOption
    }
    try {
        const logs = await ClubLog.find({
            club: clubId, 
            type: "member_join"
        });

        // this gives an object with dates as keys
        const groups = logs.reduce((groups, obj) => {
            const date = moment(obj.createdAt).format(timeFormat);
            if (!groups[date]) {
                groups[date] = [];
            }
            groups[date].push(obj);
            return groups;
        }, {});

        if (JSON.stringify(groups) === '{}') {
            res.status(200).send([])
            return
        }

        // Edit: to add it in the array format instead
        const groupArrays = Object.keys(groups).map((date) => {
            return {
                "Date": date,
                "scales": groups[date].length
            };
        });
        if (groupArrays.length <= 1) {
            let date = groupArrays[0].Date
            switch (timeFormat) {
                case "YYYY-MM-DD":
                    date = moment(date).subtract(1, 'days').startOf('day').format(timeFormat)
                    break;
                case "YYYY-MM":
                    date = moment(date).subtract(1, 'months').startOf('month').format(timeFormat)
                    break;
                case "YYYY":
                    date = moment(date).subtract(1, 'years').startOf('year').format(timeFormat)
                    break;
                default:
                    break;
            }
            const temp = {
                Date: date,
                scales: 0,
            }
            res.send([temp].concat(groupArrays))
            return
        }
        res.send(groupArrays)
    } catch (err) {
        console.log("🚀 ~ file: statisticControllers.js:62 ~ module.exports.statisticMemberJoinOfClub= ~ err:", err)
        res.status(500).send({ error: err.message })
    }
}

module.exports.statisticMemberLeaveOfClub = async (req, res) => {
    const clubId = req.params.clubId;
    const { selectOption } = req.query
    let timeFormat = "YYYY-MM-DD"
    if (selectOption !== undefined) {
        timeFormat = selectOption
    }
    try {
        const logs = await ClubLog.find({
            club: clubId, 
            type: "member_out"
        });
        // this gives an object with dates as keys
        const groups = logs.reduce((groups, obj) => {
            const date = moment(obj.createdAt).format(timeFormat);
            if (!groups[date]) {
                groups[date] = [];
            }
            groups[date].push(obj);
            return groups;
        }, {});

        if (JSON.stringify(groups) === '{}') {
            res.status(200).send([])
            return
        }

        // Edit: to add it in the array format instead
        const groupArrays = Object.keys(groups).map((date) => {
            return {
                "Date": date,
                "scales": groups[date].length
            };
        });
        if (groupArrays.length <= 1) {
            let date = groupArrays[0].Date
            switch (timeFormat) {
                case "YYYY-MM-DD":
                    date = moment(date).subtract(1, 'days').startOf('day').format(timeFormat)
                    break;
                case "YYYY-MM":
                    date = moment(date).subtract(1, 'months').startOf('month').format(timeFormat)
                    break;
                case "YYYY":
                    date = moment(date).subtract(1, 'years').startOf('year').format(timeFormat)
                    break;
                default:
                    break;
            }
            const temp = {
                Date: date,
                scales: 0,
            }
            res.send([temp].concat(groupArrays))
            return
        }
        res.send(groupArrays)
    } catch (err) {
        res.status(500).send({ error: err.message })
    }
}

module.exports.statisticFundGrowthOfClub = async (req, res) => {
    const clubId = req.params.clubId;
    const { selectOption } = req.query;
    let timeFormat = "YYYY-MM-DD"
    if (selectOption !== undefined) {
        timeFormat = selectOption
    }
    try {
        const funds = await FundHistory.find({ club: clubId })
            .sort({ createdAt: 1 });

        const groups = funds.reduce((groups, obj) => {
            const date = moment(obj.createdAt).format(timeFormat);
            if (!groups[date]) {
                groups[date] = [];
            }
            groups[date].push(obj);
            return groups;
        }, {});

        if (JSON.stringify(groups) === '{}') {
            res.status(200).send([])
            return
        }

        let arr = []
        let fund = 0
        Object.keys(groups).map((date) => {
            groups[date].forEach(obj => {
                if (obj.type === "Thu" || obj.type === "Thu mỗi tháng") {
                    fund = fund + obj.total
                } else {
                    fund = fund - obj.total
                }
            });
            let temp = {
                Date: date,
                value: fund,
            }
            arr.push(temp)
        });
        if (arr.length <= 1) {
            let date = arr[0].Date
            switch (timeFormat) {
                case "YYYY-MM-DD":
                    date = moment(date).subtract(1, 'days').startOf('day').format(timeFormat)
                    break;
                case "YYYY-MM":
                    date = moment(date).subtract(1, 'months').startOf('month').format(timeFormat)
                    break;
                case "YYYY":
                    date = moment(date).subtract(1, 'years').startOf('year').format(timeFormat)
                    break;
                default:
                    break;
            }
            const temp = {
                Date: date,
                value: 0,
            }
            res.send([temp].concat(arr))
            return
        }
        res.send(arr)
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
}

module.exports.statisticFundWithTypeOfClub = async (req, res) => {
    const clubId = req.params.clubId;
    const { selectOption, typeArr } = req.query
    let timeFormat = "YYYY-MM-DD", typeSelected = ["Thu", "Chi", "Thu mỗi tháng"]
    if (selectOption !== undefined) {
        timeFormat = selectOption
    }
    if (typeArr !== undefined) {
        typeSelected = typeArr
        if (typeArr.includes("Thu")) {
            typeSelected = [...typeArr, "Thu mỗi tháng"]
        }
    }
    try {
        const funds = await FundHistory.find({ club: clubId, type: { $in: typeSelected } })
            .sort({ createdAt: 1 });

        const groups = funds.reduce((groups, obj) => {
            const date = moment(obj.createdAt).format(timeFormat);
            if (!groups[date]) {
                groups[date] = [];
            }
            groups[date].push(obj);
            return groups;
        }, {});
        
        if (JSON.stringify(groups) === '{}') {
            res.status(200).send([])
            return
        } 

        let arr = []
        Object.keys(groups).map((date) => {
            let colFund = {
                Date: date,
                value: 0,
                type: "Thu"
            }
            let payFund = {
                Date: date,
                value: 0,
                type: "Chi"
            }
            groups[date].forEach(obj => {
                if (obj.type === "Thu" || obj.type === "Thu mỗi tháng") {
                    colFund["value"] = colFund["value"] + obj.total
                } else {
                    payFund["value"] = payFund["value"] + obj.total
                }
            });
            arr.push(colFund)
            arr.push(payFund)
        });
        if (arr.length <= 3) {
            console.log(arr)
            let date = arr[0].Date
            switch (timeFormat) {
                case "YYYY-MM-DD":
                    date = moment(date).subtract(1, 'days').startOf('day').format(timeFormat)
                    break;
                case "YYYY-MM":
                    date = moment(date).subtract(1, 'months').startOf('month').format(timeFormat)
                    break;
                case "YYYY":
                    date = moment(date).subtract(1, 'years').startOf('year').format(timeFormat)
                    break;
                default:
                    break;
            }
            const colFund = {
                Date: date,
                value: 0,
                type: "Thu"
            }
            const payFund = {
                Date: date,
                value: 0,
                type: "Chi"
            }
            res.send([colFund, payFund].concat(arr))
            return
        }
        res.send(arr)
    } catch (err) {
        console.error("🚀 ~ file: statisticControllers.js:263 ~ module.exports.statisticFundWithTypeOfClub= ~ err:", err)
        res.status(500).send({ error: err.message })
    }
}

module.exports.statisticMonthlyFundGrowthOfClub = async (req, res) => {
    const clubId = req.params.clubId;
    const { selectOption } = req.query;
    let timeFormat = "YYYY-MM"
    if (selectOption !== undefined) {
        timeFormat = selectOption
    }
    try {
        const funds = await FundHistory.find({ club: clubId, type: "Thu mỗi tháng" })
            .sort({ createdAt: 1 });

        const groups = funds.reduce((groups, obj) => {
            const date = moment(obj.createdAt).format(timeFormat);
            if (!groups[date]) {
                groups[date] = [];
            }
            groups[date].push(obj);
            return groups;
        }, {});

        if (JSON.stringify(groups) === '{}') {
            res.status(200).send([])
            return
        }

        let arr = []
        Object.keys(groups).map((date) => {
            let fund = 0
            groups[date].forEach(obj => {
                fund = fund + obj.total
            });
            let temp = {
                Date: date,
                value: fund,
            }
            arr.push(temp)
        });
        if (arr.length <= 1) {
            let date = arr[0].Date
            switch (timeFormat) {
                case "YYYY-MM":
                    date = moment(date).subtract(1, 'months').startOf('month').format(timeFormat)
                    break;
                case "YYYY":
                    date = moment(date).subtract(1, 'years').startOf('year').format(timeFormat)
                    break;
                default:
                    break;
            }
            const temp = {
                Date: date,
                value: 0,
            }
            res.status(200).send([temp].concat(arr))
            return
        }
        res.send(arr)
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
}

module.exports.statisticQuantitySubmittedMonthlyFundOfClub = async (req, res) => {
    const clubId = req.params.clubId;
    const { selectOption } = req.query
    let timeFormat = "YYYY-MM"
    if (selectOption !== undefined) {
        timeFormat = selectOption
    }
    try {
        const funds = await FundHistory.find({ club: clubId, type: "Thu mỗi tháng" })
            .sort({ createdAt: 1 });

        const groups = funds.reduce((groups, obj) => {
            const date = moment(obj.createdAt).format(timeFormat);
            if (!groups[date]) {
                groups[date] = [];
            }
            let quantity = 0
            obj.submitted.forEach((sub) => {
                if (sub.total > 0) {
                    quantity = quantity + 1
                } 
            })
            groups[date].push({quantity});
            return groups;
        }, {});

        if (JSON.stringify(groups) === '{}') {
            res.status(200).send([])
            return
        }

        let arr = []
        Object.keys(groups).map((date) => {
            let quantity = 0
            groups[date].forEach(obj => {
                quantity = quantity + obj.quantity
            });
            let temp = {
                Date: date,
                value: quantity,
            }
            arr.push(temp)
        });
        if (arr.length <= 1) {
            let date = arr[0].Date
            switch (timeFormat) {
                case "YYYY-MM":
                    date = moment(date).subtract(1, 'months').startOf('month').format(timeFormat)
                    break;
                case "YYYY":
                    date = moment(date).subtract(1, 'years').startOf('year').format(timeFormat)
                    break;
                default:
                    break;
            }
            const temp = {
                Date: date,
                value: 0,
            }
            res.send([temp].concat(arr))
            return
        }
        res.send(arr)
    } catch (err) {
        res.status(500).send({ error: err.message })
    }
}