const mongoose = require('mongoose');

const activityCardSchema = new mongoose.Schema({
    board: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ActivityBoard',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    order: {
        type: Number,
        default: 1
    },
    description: String,
    file_url: [{
        type: String
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

activityCardSchema.statics.getLastOrder = async function(boardId) {

}

const ActivityCard = mongoose.model('activityCards', activityCardSchema)
module.exports = ActivityCard;

