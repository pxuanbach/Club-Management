const User = require('../models/User');
const jwt = require('jsonwebtoken');
const maxAge = 5 * 24 * 60 * 60;
const createJWT = id => {
    return jwt.sign({ id }, 'club secret', {
        expiresIn: maxAge
    })
}

const alertError = (err) => {
    let errors = { username: '', password: '', name: '', email: '' }
    if (err.message === 'incorrect email') {
        errors.email = 'Email không tồn tại';
    }
    if (err.message === 'incorrect password') {
        errors.password = 'Mật khẩu sai';
    }
    if (err.code === 11000) {
        if (err.message.includes('username')) {
            errors.username = 'Tài khoản đã tồn tại'
        }

        if (err.message.includes('email')) {
            errors.email = 'Email đã được sử dụng';
        }
        return errors;
    }
    if (err.message === 'Mật khẩu sai') {
        errors.password = 'Mật khẩu sai';
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
        console.log('This is ERROR', error.message)
        res.status(400).json({ errors })
    }
    res.send()
}

module.exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.login(username, password);
        const token = createJWT(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })
        res.status(201).json({ user });
    } catch (error) {
        let errors = alertError(error);
        console.log(error.message)
        res.status(400).json({ errors })
    }
    res.send()
}
module.exports.verifyuser = (req, res, next) => {
    const token = req.cookies.jwt;
    //console.log(req)
    if (token) {
        jwt.verify(token, 'club secret', async (err, decodedToken) => {
            console.log('decoded Token', decodedToken);
            if (err) {
                console.log(err.message)
            } else {
                let user = await User.findById(decodedToken.id);
                res.json(user);
                next();
            }
        })
    } else {
        next();
    }
}
module.exports.logout = (req, res) => {
    res.cookie('jwt', "", { maxAge: 1 })
    res.status(200).json({ logout: true })
}