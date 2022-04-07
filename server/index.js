const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(authRoutes);
const http = require('http').createServer(app);
const mongoose = require('mongoose')
const socketio = require('socket.io')
const io = socketio(http)
const mongoDB = "mongodb+srv://pxuanbach:094864Bach@cluster0.axgxb.mongodb.net/club-database?retryWrites=true&w=majority"
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => console.log('connected'))
    .catch(err => console.log(err))
const PORT = process.env.PORT || 5000
const { addUser, removeUser, getUser } = require('./helper/UserHelper');
const { ConvertClubs, ConvertUsers } = require('./helper/ConvertDataHelper')
const Club = require('./models/Club')
const User = require('./models/User');

io.on('connection', (socket) => {
    console.log(socket.id)
    Club.find().then(result => {
        //console.log('output-clubs: ', result)
        socket.emit('output-clubs', ConvertClubs(result))
    })
    User.find({ username: { $nin: ['admin', 'admin0'] } }).then(result => {

        socket.emit('output-users', ConvertUsers(result))
        //console.log(result)
    })

    //join chat room, club chat room
    socket.on('join', ({ name, room_id, user_id }) => {
        const { error, user } = addUser({
            socket_id: socket.id,
            name,
            user_id,
            room_id
        })
        socket.join(room_id);
        if (error) {
            console.log('join error', error)
        } else {
            console.log('join user', user)
        }
    })
    socket.on('get-club', ({ club_id }) => {
        Club.findOne({ _id: club_id }).then(result => {
            io.emit('output-club', result)
        })
    })

    socket.on('create-club', (name, img_url, description, leader, treasurer, callback) => {
        const club = new Club({ name, img_url, description, leader, treasurer });
        club.save().then(result => {
            
            let newClub = {};
            newClub._id = club._id;
            newClub.name = club.name;
            newClub.img_url = club.img_url;
            newClub.description = club.description;
            newClub.isblocked = club.isblocked;
            newClub.fund = club.fund;
            newClub.leader = club.leader.name;
            newClub.treasurer = club.treasurer.name;

            //Relation field
            newClub.members_num = 0;

            io.emit('club-created', newClub)
            console.log(result)
            callback();
        })
    })

    socket.on('account-created', (user_id, img_url) => {
        //console.log('user id', user_id)
        //console.log('img url', img_url)
        User.findById(user_id, function (err, doc) {
            if (err) return;
            if (img_url) {
                doc.img_url = img_url;
                doc.save();
            }

        })
        User.find({ username: { $nin: ['admin', 'admin0'] } }).then(result => {
            io.emit('output-users', ConvertUsers(result))
        })
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
    socket.on('disconnect', () => {
        //
    })
})

http.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
})