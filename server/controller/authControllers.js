const User = require('../models/User');
const jwt = require('jsonwebtoken');
const cloudinary = require('../helper/Cloudinary')
const fs = require('fs');
const { ConvertUser } = require('../helper/ConvertDataHelper');
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
    if (err.message === 'Tài khoản không tồn tại') {
        errors.username = 'Tài khoản không tồn tại';
        return errors;
    }
    if (err.message === 'Tài khoản đã bị chặn') {
        errors.username = 'Tài khoản đã bị chặn';
        return errors;
    }
    if (err.message.includes('user validation failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message
        })
    }
    return errors;
}

async function uploadAvatar(files, public_id) {
    if (files.length > 0) {
        const { path } = files[0]

        const newPath = await cloudinary.uploader.upload(path, {
            resource_type: 'auto',
            folder: 'Club-Management/User-Avatar'
        }).catch(error => {
            console.log(error)
            return {
                url: '',
                public_id: ''
            }
        })
        fs.unlinkSync(path)
        if (public_id !== '') {
            await cloudinary.uploader.destroy(public_id, function (result) {
                console.log("destroy image", result);
            }).catch(err => {
                console.log("destroy image err ", err.message)
            })
        }
        return {
            url: newPath.url,
            public_id: newPath.public_id
        }
    }
    return {
        url: '',
        public_id: ''
    }
}

module.exports.signup = async (req, res) => {
    const files = req.files
    const { username, password, name, email } = req.body;

    try {
        const user = await User.create({
            username,
            password,
            name,
            email
        });
        const uploadData = await uploadAvatar(files, '');
        user.img_url = uploadData.url;
        user.cloudinary_id = uploadData.public_id;
        user.save().then(result => {
            res.status(201).send(ConvertUser(result));
        }).catch(err => {
            res.status(400).send({ error: err.message })
        })

    } catch (error) {
        let errors = alertError(error);
        console.log('This is ERROR', error.message)
        res.status(400).send({ errors })
    }
}

module.exports.login = async (req, res) => {
    const { username, password } = req.body;
    //console.log(req.body)
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
    //console.log(req.cookies.jwt)
    if (token) {
        jwt.verify(token, 'club secret', async (err, decodedToken) => {
            console.log('decoded Token', decodedToken);
            if (err) {
                console.log(err.message)
            } else {
                let user = await User.findById(decodedToken.id);
                if (user.isblocked) {
                    console.log('blocked')
                    res.cookie('jwt', "", { maxAge: 1 })
                } else {
                    res.json(user);
                }
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

module.exports.update = async (req, res) => {
    const token = req.cookies.jwt;
    const files = req.files
    const { name, gender, email, description, facebook } = req.body

    if (token) {
        jwt.verify(token, 'club secret', async (err, decodedToken) => {
            console.log('decoded Token', decodedToken);
            if (err) {
                console.log("decoded err ", err.message)
                res.status(400).send({ error: err.message })
            } else {
                try {
                    let user = await User.findById(decodedToken.id)
                    user.name = name;
                    user.gender = gender;
                    user.email = email;
                    user.description = description;
                    user.facebook = facebook

                    const uploadData = await uploadAvatar(files, user.cloudinary_id);
                    
                    user.img_url = uploadData.url;
                    user.cloudinary_id = uploadData.public_id;

                    user.save().then(result => {
                        res.status(200).send(result)
                    }).catch(err => {
                        res.status(400).send({ error: err.message })
                    })
                } catch (error) {
                    let errors = alertError(error);
                    console.log("catch ", error.message)
                    res.status(400).json({ errors })
                }
            }
        })
    } else {
        res.status(400).send({ error: "Không tìm thấy token" })
    }
}

module.exports.changePassword = (req, res) => {
    const token = req.cookies.jwt;
    const { password, newPassword } = req.body
}