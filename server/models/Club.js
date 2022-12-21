const mongoose = require('mongoose')

const clubSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    img_url: String,
    cloudinary_id: String,
    description: String,
    fund: {
        type: Number,
        default: 0,
    },
    leader: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    treasurer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    isblocked: {
        type: Boolean,
        default: false
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    }],
    monthlyFund: {
        type: Number,
        default: 0
    },
    monthlyFundPoint: {
        type: Number,
        default: 0
    }
})

const Club = mongoose.model('club', clubSchema)
module.exports = Club;