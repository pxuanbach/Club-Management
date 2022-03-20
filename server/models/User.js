const mongoose = require('mongoose');
const {isEmail} = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please enter a username']
    },
    password: {
        type: String,
        required: [true, 'Please enter a password'],
        minlength: [6, 'The password should be at least 6 characters long'],
    },
    img_url: String,
    name: String,
    email: {
        type: String,
        unique: [true, 'Duplicate'],
        lowercase: true,
        validate: [isEmail, 'Please enter a valid email address']
    },
    description: String,
    isBlocked: {
        type: Boolean,
        default: false
    },
})

const User = mongoose.model('user', userSchema)
module.exports = User;