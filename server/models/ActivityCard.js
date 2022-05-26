const mongoose = require('mongoose');

const activityCardSchema = new mongoose.Schema({
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
        ref: 'Group'
    }]
})

const ActivityCard = mongoose.model('activityCards', activityCardSchema)
module.exports = ActivityCard;

