const { ConvertClub, ConvertClubs } = require('../helper/ConvertDataHelper')
const Club = require('../models/Club')
const cloudinary = require('../helper/Cloudinary')

module.exports = function (socket, io) {
    Club.find().then(result => {
        //console.log('output-clubs: ', result)
        socket.emit('output-clubs', ConvertClubs(result))
    })

    socket.on('get-club', ({ club_id }) => {
        Club.findOne({ _id: club_id }).then(result => {
            io.emit('output-club', result)
        })
    })

    socket.on('create-club', (name, img_url, cloudinary_id, description, leader, treasurer, callback) => {
        const club = new Club({ name, img_url, cloudinary_id, description, leader, treasurer });
        club.save().then(result => {
            let newClub = ConvertClub(result);

            io.emit('club-created', newClub)
            console.log(result)
            callback();
        })
    })

    socket.on('update-club-info', (club_id, name, description, new_img_url, new_cloud_id, cur_cloud_id, callback) => {
        console.log('club want to update: ', club_id)
        Club.findById(club_id, function (err, doc) {
            if (err) {
                console.log(err)
                return;
            }

            doc.name = name;
            doc.description = description;

            if (new_img_url) {
                cloudinary.uploader.destroy(cur_cloud_id, function (result) {
                    console.log(result);
                })
                doc.img_url = new_img_url;
                doc.cloudinary_id = new_cloud_id;
            }

            doc.save().then(result => {
                let updatedClub = ConvertClub(result)

                io.emit('club-updated', updatedClub)
                console.log(result)
                callback();
            })
        }
        )
        callback();
    })

    socket.on('block-unblock-club', (club_id) => {
        Club.findById(club_id, function (err, doc) {
            if (err) return;
            doc.isblocked = !doc.isblocked;
            doc.save();
        })
    })

    socket.on('delete-club', (club_id, cloudinary_id, callback) => {
        console.log('club want to delete: ', club_id)
        Club.findByIdAndDelete(club_id, function(err, doc) {
            if (err) console.log(err)
            else {
                cloudinary.uploader.destroy(cloudinary_id, function (result) {
                    console.log(result);
                })
                console.log('Delete club:', doc)
                io.emit('club-deleted', doc)
            }
        })
        callback();
    })

    socket.on('add-member', (club_id, user_id) => {
        Club.findById(club_id, function (err, doc) {
            if (err) return;
            doc.members.push(user_id)
            doc.save();
        })
    })
}