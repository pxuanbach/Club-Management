const express = require('express');
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
app.use(authRoutes)
const http = require('http').createServer(app);
const mongoose = require('mongoose')
const socketio = require('socket.io')
const io = socketio(http)
const mongoDB = "mongodb+srv://pxuanbach:094864Bach@cluster0.axgxb.mongodb.net/club-database?retryWrites=true&w=majority"
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => console.log('connected'))
    .catch(err => console.log(err))
const PORT = process.env.PORT || 5000
const Club = require('./models/Club')
const User = require('./models/User');

function ConvertClubs(data) {
    let clubs = []

    data.forEach(elm => {
        let club = {}

        club._id = elm._id;
        club.name = elm.name;
        club.img_url = elm.img_url;
        club.description = elm.description;
        club.isblocked = elm.isblocked;
        club.fund = elm.fund;

        //Relation field
        club.leader = '';
        club.members_num = 0;

        clubs.push(club);
    })

    return clubs;
}

function ConvertUsers(data) {
    let users = []

    data.forEach(elm => {
        let user = {}

        user._id = elm._id;
        user.name = elm.name;
        user.username = elm.username;
        user.img_url = elm.img_url;
        user.email = elm.email;
        user.isblocked = elm.isblocked;
        user.groups_num = elm.groups.length;

        users.push(user)
    });

    return users;
}

io.on('connection', (socket) => {
    console.log(socket.id)
    Club.find().then(result => {
        //console.log('output-clubs: ', result)
        socket.emit('output-clubs', ConvertClubs(result))
    })
    User.find({username: {$ne: 'admin'}}).then(result => {
        
        socket.emit('output-users', ConvertUsers(result))
        //console.log(result)
    })

    socket.on('create-club', (name, img_url, description, callback) => {
        const club = new Club({ name, img_url, description });
        club.save().then(result => {
            let newClub = {};
            newClub._id = club._id;
            newClub.name = club.name;
            newClub.img_url = club.img_url;
            newClub.description = club.description;
            newClub.isblocked = club.isblocked;
            newClub.fund = club.fund;

            //Relation field
            newClub.leader = '';
            newClub.members_num = 0;

            io.emit('club-created', newClub)
            console.log(result)
            callback();
        })
    }) 

    socket.on('account-created', (user_id, img_url) => {
        //console.log('user id', user_id)
        //console.log('img url', img_url)
        User.findById(user_id, function(err, doc) {
            if (err) return;
            doc.img_url = img_url;
            doc.save();
        })
        User.find({username: {$ne: 'admin'}}).then(result => {
            io.emit('output-users', ConvertUsers(result))
        })
    })

    socket.on('disconnect', () => {
        //
    })
})

http.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
})