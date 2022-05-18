const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    club: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'club',
        required: true
    },
    content: String,
    startDate: Date,
    endDate: Date,
}, {timestamps: true})

const Activity = mongoose.model('activities', activitySchema)
module.exports = Activity;
