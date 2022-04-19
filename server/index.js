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
const { removeUser } = require('./helper/ChatRoomHelper');

io.on('connection', (socket) => {
    console.log(socket.id)
    require('./controller/clubControllers')(socket, io);
    require('./controller/userControllers')(socket, io);
    require('./controller/chatRoomControllers')(socket, io);

    socket.on('disconnect', () => {
        const user = removeUser(socket.id);
        console.log('A user disconnected', user)
    })
})

http.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
})






