const mongoose = require('mongoose')

const clubSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    description: String,
    fund: Number,
})

const Club = mongoose.model('club', clubSchema)
module.exports = Club;