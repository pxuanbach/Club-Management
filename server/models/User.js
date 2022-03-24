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
    description: {
        type: String,
        default: '',
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
})
userSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
})
userSchema.statics.login = async function(username, password) {
    const user = await this.findOne({username});
    if (user) {
        const isAuthenticated = await bcrypt.compare(password, user.password);
        if (isAuthenticated) {
            return user;
        }
        throw Error('incorrect password');
    } else {
        throw Error('incorrect email');
    }
}
const User = mongoose.model('user', userSchema)
module.exports = User;