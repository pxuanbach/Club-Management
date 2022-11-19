const Club = require("../models/Club");
const Point = require("../models/Point");

function add_filter(reqQuery) {
    const { author, type } = reqQuery
    let query = null;
    if (type !== undefined) {
        if (Array.isArray(type)) {
            query = { ...query, type: { $in: type } }
        } else {
            query = { ...query, type: type }
        }
    }
    if (author !== undefined) {
        if (Array.isArray(author)) {
            query = { ...query, author: { $in: author } }
        } else {
            query = { ...query, author: author }
        }
    }
    return query
}

module.exports.getPointsOfClub = async (req, res) => {
    const clubId = req.params.clubId;
    const query = add_filter(req.query)
    try {
        const club = await Club.findById(clubId);
        if (club === null) {
            res.status(404).send({ message: "Không tìm thấy câu lạc bộ này." });
            return;
        }
        const points = await Point.find({ ...query, club: clubId })
            .populate("club")
            .populate("author");
        
        res.send(points)
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
};

module.exports.reportOfClub = (req, res) => { };

module.exports.createPointOfClub = async (req, res) => {
    const clubId = req.params.clubId;
    const { title, value, author, type, content } = req.body;
    try {
        const club = await Club.findById(clubId);
        if (club === null) {
            res.status(404).send({ message: "Không tìm thấy câu lạc bộ này." });
            return;
        }
        const point = new Point({
            title,
            club: clubId,
            value,
            author,
            type,
            content,
        });
        await point.save();
        res.send(point);
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
};
