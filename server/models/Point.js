const mongoose = require('mongoose');

const pointSchema = new mongoose.Schema({
    club: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'club',
        required: true
    },
    value: {
        type: Number,
        default: 0
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },
    type: {
        type: String,
        lowercase: true,
        // member/group
    },
    content: {
        type: String,
    }
}, {timestamps: true})

const Activity = mongoose.model('activities', activitySchema)
module.exports = Activity;
