const User = require('../models/User')
const Activity = require('../models/Activity')
const ActivityCard = require('../models/ActivityCard')
const { isElementInArray } = require('../helper/ArrayHelper')

async function getActivityIdByCardGroupJoin(userId) {
    let activityArr = []

    let cards = await ActivityCard.aggregate([
        {
            $lookup: {
                from: "groups",
                localField: "groupJoin",
                foreignField: "_id",
                as: "join"
            }
        },
    ])

    cards.forEach(card => {
        for (let i = 0; i < card.join.length; i++) {
            //card.join[i] === group
            if(isElementInArray(userId, card.join[i].members)) {
                activityArr.push(card.activity)
                break;
            }
        }
    })

    return activityArr;
}

module.exports.getScheduler = async (req, res) => {
    const userId = req.params.userId;

    const activityGroupJoin = await getActivityIdByCardGroupJoin(userId)
    
    res.send(activityGroupJoin)
}