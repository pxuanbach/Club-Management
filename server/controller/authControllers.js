const User = require('../models/User');

const alertError = (err) => {
    let errors = { username: '', password: '', name: '', email: '' }
    if (err.message === 'incorrect email') {
        errors.email = 'Email không tồn tại';
    }
    if (err.message === 'incorrect password') {
        errors.password = 'Mật khẩu sai';
    }
    if (err.code === 11000) {
        errors.email = 'Email đã được sử dụng';
        return errors;
    }
    if (err.message.includes('user validation failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message
        })
    }
    return errors;
}

module.exports.signup = async (req, res) => {
    const { username, password, img_url, name, email } = req.body;
    try {
        const user = await User.create({ username, password, img_url, name, email });
        res.status(201).json({user});
    } catch (error) {
        let errors = alertError(error);
        //console.log('This is ERROR', error.message)
        res.status(400).json({ errors })
    }
    res.send()
}