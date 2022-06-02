const mongoose = require('mongoose');

const activityCardSchema = new mongoose.Schema({
    activity: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'activities'
    },
    title: {
        type: String,
        required: true
    },
    description: String,
    file: [{
        url: String,
        cloudId: String,
    }],
    userJoin: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }],
    groupJoin: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'group'
    }],
    comments: [{
        content: String,
        createdAt: Date,
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        }
    }]
})

const ActivityCard = mongoose.model('activityCards', activityCardSchema)
module.exports = ActivityCard;

