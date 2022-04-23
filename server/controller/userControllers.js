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
        User.find({ username: { $nin: ['admin', 'admin0'] } }).then(result => {
            let users = []
            result.forEach((user) => {
                if (user.username.includes(search_value)) {
                    users.push(user);
                } else if (user.name.includes(search_value)) {
                    users.push(user);
                } else if (user.email.includes(search_value)) {
                    users.push(user)
                }
            })
            io.emit('output-search-user', users)
        })
    })
}