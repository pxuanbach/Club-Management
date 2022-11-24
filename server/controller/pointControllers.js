const Club = require("../models/Club");
const Point = require("../models/Point");
const mongoose = require('mongoose');
const User = require("../models/User");

module.exports.getPointsOfClub = async (req, res) => {
    const clubId = req.params.clubId;
    const { startDate, endDate, justCurrentMember } = req.query
    try {
        const club = await Club.findById(clubId);
        if (club === null) {
            res.status(404).send({ error: "Không tìm thấy câu lạc bộ này." });
            return;
        }

        let members = club.members
        members.push(club.leader)
        members.push(club.treasurer)
        const points = await Point.aggregate([
            {
                $lookup: {
                    from: "users", // name of the foreign collection
                    localField: "user",
                    foreignField: "_id",
                    as: "user-data"
                }
            },
            {
                $match: {
                    club: mongoose.Types.ObjectId(clubId),
                    createdAt: {
                        $gte: new Date(startDate),
                        $lte: new Date(endDate)
                    },
                    user: justCurrentMember === "true" ? { $in: members } : { $ne: ''}
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
                            img_url: { $last: '$user-data.img_url' }
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
                        img_url: user.img_url
                    },
                    point: 0
                })
            })
        }
        res.send(clonePoints)
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
