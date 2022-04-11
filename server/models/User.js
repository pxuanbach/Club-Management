const mongoose = require('mongoose');
const {isEmail} = require('validator');
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10

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
    cloudinary_id: String,
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

userSchema.pre('save', function(next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);
        console.log('no hash', user.password)
        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);
            // override the cleartext password with the hashed one
            user.password = hash;
            console.log('hash', user.password)
            next();
        });
    });
});

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