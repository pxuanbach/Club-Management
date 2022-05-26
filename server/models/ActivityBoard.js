const mongoose = require('mongoose');

const activityBoardSchema = new mongoose.Schema({
    activity: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Activity',
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
    cards: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ActivityCard'
    }]
})

activityBoardSchema.statics.getLastOrder = async function(activityId) {

}

const ActivityBoard = mongoose.model('activityBoards', activityBoardSchema)
module.exports = ActivityBoard;

