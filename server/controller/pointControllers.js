const Club = require("../models/Club");
const Activity = require("../models/Activity");
const Point = require("../models/Point");
const ActivityPoint = require("../models/ActivityPoint");
const mongoose = require('mongoose');
const User = require("../models/User");

const pointsOfClub = async (club, startDate, endDate, justCurrentMember, search = "") => {
    let members = club.members
    members.push(club.leader)
    members.push(club.treasurer)
    const points = await Point.aggregate([
        {
            $lookup: {
                from: "users", // name of the foreign collection
                localField: "user",
                foreignField: "_id",
                as: "user-data",
            }
        },
        {
            $match: {
                club: mongoose.Types.ObjectId(club._id),
                createdAt: {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                },
                user: justCurrentMember === "true" ? { $in: members } : { $ne: '' },
            },
        },
        {
            $group: {
                _id: '$user',
                data: {
                    $last: {
                        name: { $last: '$user-data.name' },
                        username: { $last: '$user-data.username' },
                        email: { $last: '$user-data.email' },
                        img_url: { $last: '$user-data.img_url' },
                        gender: { $last: '$user-data.gender' },
                        phone: { $last: '$user-data.phone' },
                        facebook: { $last: '$user-data.facebook' },
                    }
                },
                point: { $sum: "$value" }
            }
        },
        { $sort: { point: -1 } }
    ])

    // members not have point => point = 0
    const usersNotInPoints = await User.find({
        $and: [
            { _id: { $in: members } },
            { _id: { $nin: points.map((p) => { return p._id }) } }
        ]
    })
    // console.log(usersNotInPoints)
    let clonePoints = JSON.parse(JSON.stringify(points))
    if (usersNotInPoints.length > 0) {
        usersNotInPoints.forEach((user) => {
            clonePoints.push({
                _id: user._id,
                data: {
                    name: user.name,
                    username: user.username,
                    email: user.email,
                    img_url: user.img_url,
                    gender: user.gender,
                    phone:user.phone,
                    facebook: user.facebook,
                },
                point: 0
            })
        })
    }
    // search
    const searchValue = search !== undefined ? search : '';
    clonePoints = clonePoints.filter((point) => {
        return point.data.username.includes(searchValue)
            || point.data.name.includes(searchValue)
            || point.data.email.includes(searchValue)
    })
    return clonePoints
}

const activityPointsOfActivity = async (activity, search = "", ids) => {
    // console.log(ids)
    const points = await ActivityPoint.aggregate([
        {
            $lookup: {
                from: "users", // name of the foreign collection
                localField: "user",
                foreignField: "_id",
                as: "user-data",
            }
        },
        {
            $match: {
                activity: mongoose.Types.ObjectId(activity._id),
                user: { $in: ids }
            },
        },
        {
            $group: {
                _id: '$user',
                data: {
                    $last: {
                        name: { $last: '$user-data.name' },
                        username: { $last: '$user-data.username' },
                        email: { $last: '$user-data.email' },
                        img_url: { $last: '$user-data.img_url' },
                        gender: { $last: '$user-data.gender' },
                        phone: { $last: '$user-data.phone' },
                        facebook: { $last: '$user-data.facebook' },
                    }
                },
                point: { $sum: "$value" }
            }
        },
        { $sort: { point: -1 } }
    ])
    const usersNotInPoints = await User.find({
        $and: [
            { _id: { $in: ids } },
            { _id: { $nin: points.map((p) => { return p._id }) } }
        ]
    })
    // console.log(usersNotInPoints)
    let clonePoints = JSON.parse(JSON.stringify(points))
    if (usersNotInPoints.length > 0) {
        usersNotInPoints.forEach((user) => {
            clonePoints.push({
                _id: user._id,
                data: {
                    name: user.name,
                    username: user.username,
                    email: user.email,
                    img_url: user.img_url,
                    gender: user.gender,
                    phone:user.phone,
                    facebook: user.facebook,
                },
                point: 0
            })
        })
    }
    // search
    const searchValue = search !== undefined ? search : '';
    clonePoints = clonePoints.filter((point) => {
        return point.data.username.includes(searchValue)
            || point.data.name.includes(searchValue)
            || point.data.email.includes(searchValue)
    })
    return clonePoints
}

module.exports = {
    pointsOfClub,
    activityPointsOfActivity
}

module.exports.getPointsOfClub = async (req, res) => {
    const clubId = req.params.clubId;
    const { startDate, endDate, justCurrentMember, search } = req.query
    try {
        const club = await Club.findById(clubId);
        if (club === undefined || club === null) {
            res.status(404).send({ error: "Không tìm thấy câu lạc bộ này." });
            return;
        }
        const points = await pointsOfClub(club, startDate, endDate, justCurrentMember, search)
        res.send(points)
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
};

module.exports.getPointsOfMember = async (req, res) => {
    const clubId = req.params.clubId;
    const userId = req.params.userId;
    const { startDate, endDate } = req.query
    try {
        const club = await Club.findById(clubId);
        if (club === null) {
            res.status(404).send({ error: "Không tìm thấy câu lạc bộ này." });
            return;
        }
        const points = await Point.find({
            club: clubId,
            user: userId,
            createdAt: {
                $gte: startDate,
                $lte: endDate
            },
        }).populate('user')
            .populate('author')
            .sort({ createdAt: -1 })
        let totalPoint = 0
        points.map(point => {
            totalPoint += point.value
        })
        res.status(200).send({
            totalPoint: totalPoint,
            points: points
        })
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
}

module.exports.reportOfClub = (req, res) => {
    const clubId = req.params.clubId;
    const { startDate, endDate } = req.query
};

module.exports.createPointOfClub = async (req, res) => {
    const clubId = req.params.clubId;
    const { title, value, author, user } = req.body;
    try {
        const club = await Club.findById(clubId);
        if (club === null) {
            res.status(404).send({ error: "Không tìm thấy câu lạc bộ này." });
            return;
        }
        const point = new Point({
            title,
            club: clubId,
            value,
            author,
            user,
        });
        await point.save();
        res.send(point);
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
};

module.exports.createMultiPointsOfClub = async (req, res) => {
    const clubId = req.params.clubId;
    const { title, value, author, users } = req.body;
    try {
        const club = await Club.findById(clubId);
        if (club === null) {
            res.status(404).send({ error: "Không tìm thấy câu lạc bộ này." });
            return;
        }

        let pointArr = [];
        users.map((uid) => {
            pointArr.push({
                club: clubId,
                title,
                value,
                author,
                user: uid,
            });
        });
        const result = await Point.insertMany(pointArr);
        res.status(200).send(result);
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
};

module.exports.getPointsOfActivity = async (req, res) => {
    const activityId = req.params.activityId
    const { search } = req.query
    try {
        const activity = await Activity.findById(activityId)
        if (activity === undefined || activity === null) {
            res.status(404).send({ error: "Không tìm thấy hoạt động này." });
            return;
        }
        const points = await activityPointsOfActivity(activity, search, activity.collaborators)
        res.send(points)
    } catch (err) {
        res.status(500).send({ error: err.message })
    }
}

module.exports.createPointOfActivity = async (req, res) => {
    const activityId = req.params.activityId
    const { title, value, author, user } = req.body;
    try {
        const activity = await Activity.findById(activityId)
        if (activity === undefined || activity === null) {
            res.status(404).send({ error: "Không tìm thấy hoạt động này." });
            return;
        }
        const activityPoint = new ActivityPoint({
            title,
            activity: activityId,
            value,
            author,
            user,
        });
        const saveResult = await activityPoint.save();
        res.send(saveResult);
    } catch (err) {
        res.status(500).send({ error: err.message })
    }
}
