const mongoose = require('mongoose');

const fundHistorySchema = new mongoose.Schema({
    club: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'club',
        required: true
    },
    content: String,
    type: {
        type: String,
        required: true
    },
    total: {
        type: Number,
        default: 0
    },
    file_url: String,
    cloudinary_id: String,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
}, {timestamps: true})

const FundHistory = mongoose.model('fundHistory', fundHistorySchema)
module.exports = FundHistory;

