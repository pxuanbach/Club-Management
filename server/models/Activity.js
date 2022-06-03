const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    club: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'club',
        required: true
    },
    title: String,
    startDate: Date,
    endDate: Date,
    boards: [{
        title: String,
        cards: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'activityCards'
        }]
    }],
    collaborators: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    }]
}, {timestamps: true})

const Activity = mongoose.model('activities', activitySchema)
module.exports = Activity;

