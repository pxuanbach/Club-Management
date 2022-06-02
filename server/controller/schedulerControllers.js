const User = require('../models/User')
const Activity = require('../models/Activity')
const ActivityCard = require('../models/ActivityCard')
const mongoose = require('mongoose')
const { uniqueArray } = require('../helper/ArrayHelper')

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
        {
            $match: {
                "join.members": { $elemMatch: { $eq: mongoose.Types.ObjectId(userId) } }
            }
        }
    ])

    cards.forEach(card => {
        activityArr.push(card.activity.toString())
    })

    return activityArr;
}

async function getActivityIdByCardUserJoin(userId) {
    let activityArr = []

    let cards = await ActivityCard.find({
        userJoin: mongoose.Types.ObjectId(userId)
    })

    cards.forEach(card => {
        activityArr.push(card.activity.toString())
    })

    return activityArr;
}

async function getActivityByCollaborators(userId) {
    let activityArr = []

    let activities = await Activity.find({ collaborators: userId })

    activities.forEach(activity => {
        activityArr.push(activity._id.toString())
    })

    return activityArr;
}

module.exports.getScheduler = async (req, res) => {
    const userId = req.params.userId;

    const activityGroupJoin =
        await getActivityIdByCardGroupJoin(userId)
            .catch(err => {
                res.status(500).send({ error: "GroupJoin find err - " + err.message })
            });
    const activityUserJoin =
        await getActivityIdByCardUserJoin(userId)
            .catch(err => {
                res.status(500).send({ error: "UserJoin find err - " + err.message })
            });
    const activityCollaborators =
        await getActivityByCollaborators(userId)
            .catch(err => {
                res.status(500).send({ error: "Collaborators find err - " + err.message })
            });

    let arrId = activityGroupJoin.concat(activityUserJoin)
    arrId = arrId.concat(activityCollaborators)

    const uniqueArrId = uniqueArray(arrId)
    Activity.find({ _id: { $in: uniqueArrId } })
    .populate('club')
    .then(result => {
        res.status(200).send(result)
    }).catch(err => {
        res.status(500).send({ error: "Activity find err - " + err.message })
    })
}