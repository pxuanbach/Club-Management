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
const http = require('http').createServer(app);
const mongoose = require('mongoose')
const socketio = require('socket.io')
const io = socketio(http);
const dotenv = require('dotenv');
dotenv.config();
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(authRoutes);

//Connect DB
mongoose
    .connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('connected'))
    .catch(err => console.log(err))


const PORT = process.env.PORT || 5000
const { addUser, removeUser, getUser } = require('./helper/UserHelper');
const {ConvertUsers} = require('./helper/ConvertDataHelper')
const Club = require('./models/Club')
const User = require('./models/User');

io.on('connection', (socket) => {
    console.log(socket.id)
    require('./controller/clubControllers')(socket, io);
    require('./controller/userControllers')(socket, io);
    
    
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

    socket.on('get-members', club_id => {
        Club.findById(club_id).then(club => {
            User.find({_id: {$in: club.members}}).then(users => {
                io.emit('output-members', ConvertUsers(users));
            })
        })
    })

    socket.on('get-users-not-members', club_id => {
        Club.findById(club_id).then(club => {
            User.find({ $and: [
                { _id: { $nin: club.members } }, 
                {_id: {$nin: [club.leader._id, club.treasurer._id]}},
                { username: { $nin: ['admin', 'admin0'] } },
            ] })
            .then(users => {
                io.emit('output-users-not-members', ConvertUsers(users))
            })
        })
        
    })

    socket.on('disconnect', () => {
        //
    })
})

http.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
})






