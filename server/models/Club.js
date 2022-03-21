const mongoose = require('mongoose')

const clubSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    img_url: String,
    description: String,
    fund: {
        type: Number,
        default: 0,
    },
    isblocked: {
        type: Boolean,
        default: false
    }
})

const Club = mongoose.model('club', clubSchema)
module.exports = Club;