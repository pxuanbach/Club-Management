const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    club: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'club',
        required: true
    },
    content: String,
    timeStart: Date,
    timeEnd: Date,
}, {timestamps})

const Activity = mongoose.model('activities', activitySchema)
module.exports = Activity;

