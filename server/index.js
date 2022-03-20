const app = require('express')();
const http = require('http').createServer(app);
const mongoose = require('mongoose')
const socketio = require('socket.io')
const io = socketio(http)
const mongoDB = "mongodb+srv://pxuanbach:094864Bach@cluster0.axgxb.mongodb.net/club-database?retryWrites=true&w=majority"
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => console.log('connected'))
.catch(err => console.log(err))
const PORT = process.env.PORT || 5000
const Club = require('./models/Club')

io.on('connection', (socket) => {
    console.log(socket.id)
    Club.find().then(result => {
        //console.log('output-clubs: ', result)
        socket.emit('output-clubs', result)
    })
    socket.on('create-club', (name, img_url, description, callback) => {
        const club = new Club({name, img_url, description});
        club.save().then(result => {
            io.emit('club-created', result)
            console.log(result)
            callback();
        })
    })
    socket.on('create-account', (username, password, callback) => {
        console.log(username, password)
    })


    socket.on('disconnect', () => {
        //
    })
})

http.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
})