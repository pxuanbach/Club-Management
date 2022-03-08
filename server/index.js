const app = require('express')();
const http = require('http').createServer(app);
const socketio = require('socket.io')
const io = socketio(http)
const PORT = process.env.PORT || 5000

io.on('connection', (socket) => {
    console.log('a user connected')
})

http.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
})