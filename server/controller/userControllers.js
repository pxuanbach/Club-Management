const { ConvertUser, ConvertUsers } = require('../helper/ConvertDataHelper')
const User = require('../models/User')

module.exports = function (socket, io) {
    socket.on('get-users', () => {
        User.find({ username: { $nin: ['admin', 'admin0'] } }).then(result => {

            socket.emit('output-users', ConvertUsers(result))
            //console.log(result)
        })
    })

    socket.on('account-created', (user_id, img_url, cloudinary_id, callback) => {
        //console.log('user id', user_id)

        User.findById(user_id, function (err, doc) {
            if (err) return;
            if (img_url) {
                doc.img_url = img_url;
                doc.cloudinary_id = cloudinary_id;
                doc.save().then(user => {
                    io.emit('new-user', ConvertUser(user))
                })
            }
        })
        callback();
    })

    socket.on('block-unblock-account', (user_id) => {
        User.findById(user_id, function (err, doc) {
            if (err) return;
            doc.isblocked = !doc.isblocked;
            doc.save();
        })
    })

    socket.on('search-user', (search_value) => {
        //console.log('search value: ', search_value)
        User.find({
            $and: [
                {
                    username: {
                        $nin: ['admin', 'admin0']
                    }
                },
                {
                    $or: [
                        { username: { $regex: search_value } },
                        { name: { $regex: search_value } },
                        { email: { $regex: search_value } }
                    ]
                }
            ]
        }).then(result => {
            io.emit('output-search-user', ConvertUsers(result))
        })
    })
}

module.exports.getList = (req, res) => {
    User.find({ username: { $nin: ['admin', 'admin0'] } }).then(result => {
        res.status(200).send(ConvertUsers(result))
    }).catch(err => {
        res.status(500).json({ error: err.message })
    })
}

module.exports.block = async (req, res) => {
    const userId = req.params.userId;

    User.findById(userId, function (err, doc) {
        if (err) {
            res.status(500).json({ error: err.message })
            return;
        }
        doc.isblocked = !doc.isblocked;
        doc.save().then(result => {
            res.status(200).send(ConvertUser(result))
        })
    })
}