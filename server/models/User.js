const mongoose = require('mongoose');
const {isEmail} = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: [true, 'Tài khoản đã tồn tại'],
        required: [true, 'Tài khoản đang trống'],
        minlength: [6, 'Tài khoản ít hơn 6 ký tự'],
    },
    password: {
        type: String,
        required: [true, 'Mật khẩu đang trống'],
        minlength: [6, 'Mật khẩu ít hơn 6 ký tự'],
    },
    img_url: String,
    name: {
        type: String,
        required: [true, 'Tên đang trống'],
    },
    email: {
        type: String,
        required: [true, 'Email đang trống'],
        unique: [true, 'Email đã tồn tại'],
        lowercase: true,
        validate: [isEmail, 'Email không hợp lệ']
    },
    description: {
        type: String,
        default: '',
    },
    isblocked: {
        type: Boolean,
        default: false
    },
    groups: [{
        type: String,
        ref: 'club'
    }]
})
userSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt();
    console.log('no hash', this.password)
    this.password = await bcrypt.hash(this.password, salt);
    console.log('hash pass', this.password)
    next();
})
userSchema.statics.login = async function(username, password) {
    const user = await this.findOne({username});
    
    if (user) {
        if (user.isblocked) {
            throw Error('Tài khoản đã bị chặn')
        }
        let isAuth = await bcrypt.compare(password, user.password);
        if (isAuth) {
            return user;
        }
        console.log(password, user.password, isAuth)
        throw Error('Mật khẩu sai');
        
    } else {
        throw Error('Tài khoản không tồn tại');
    }
}
const User = mongoose.model('user', userSchema)
module.exports = User;