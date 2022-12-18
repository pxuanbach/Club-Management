const Club = require('../models/Club');
const FundHistory = require('../models/FundHistory');
const moment = require('moment');

const isMonthlyFundExist = async (club, start, end) => {
    const fundHistory = await FundHistory.find({
        club: club._id,
        type: "Thu mỗi tháng",
        createdAt: {
            $gte: new Date(start),
            $lte: new Date(end)
        },
    })

    if (fundHistory.length > 0) {
        // console.log(fundHistory)
        return fundHistory[0]
    }
    return null
}

const generateSubmitted = (club) => {
    const submittedArr = []
    club.members.map((uid) => {
        submittedArr.push({
            member_id: uid,
            total: 0
        })
    })
    submittedArr.push({
        member_id: club.leader,
        total: 0
    })
    submittedArr.push({
        member_id: club.treasurer,
        total: 0
    })
    return submittedArr
}

const createNewMonthlyFundOfClubs = async () => {
    const clubs = await Club.find({isblocked: false});
    const startDateValue = moment().startOf('month');
    const endDateValue = moment().endOf('month');
    
    clubs.map(async (club) => {
        const fundHistory = await isMonthlyFundExist(
            club, startDateValue, endDateValue
        );
        if (fundHistory === null) {
            const submittedArr = generateSubmitted(club)
            const monthlyFund = new FundHistory({
                club: club._id,
                content: `Quỹ thu tháng ${startDateValue.format("MM/YYYY")}`,
                type: "Thu mỗi tháng",
                total: 0,
                author: club.treasurer,
                submitted: submittedArr,
            })
            await monthlyFund.save()
        }
    })
}

module.exports = {
    createNewMonthlyFundOfClubs
}