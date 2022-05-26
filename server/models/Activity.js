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
    boards: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ActivityBoard',
    }]
}, {timestamps: true})

const Activity = mongoose.model('activities', activitySchema)
module.exports = Activity;

