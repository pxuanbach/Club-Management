const mongoose = require('mongoose')

const clubSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    img_url: String,
    description: String,
    fund: Number,
})

const Club = mongoose.model('club', clubSchema)
module.exports = Club;