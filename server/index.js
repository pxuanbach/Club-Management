const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const clubRoutes = require('./routes/clubRoutes');
const userRoutes = require('./routes/userRoutes');
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
app.use(uploadRoutes);
app.use('/club', clubRoutes);
app.use('/user', userRoutes)

//Connect DB
mongoose
    .connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('connected'))
    .catch(err => console.log(err))


const PORT = process.env.PORT || 5000
const { addUser, removeUser } = require('./helper/ChatRoomHelper');

io.on('connection', (socket) => {
    console.log(socket.id)
    require('./controller/clubControllers')(socket, io);
    require('./controller/userControllers')(socket, io);
    require('./controller/chatRoomControllers')(socket, io);
    require('./controller/groupControllers')(socket, io);
    require('./controller/fundControllers')(socket, io);
    require('./controller/activityControllers')(socket, io);

    socket.on('join', ({ user_id, room_id }) => {
        const { error, user } = addUser({
            socket_id: socket.id,
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

    socket.on('disconnect', () => {
        const user = removeUser(socket.id);
        console.log('A user disconnected', user)
    })
})

http.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
})






