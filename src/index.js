const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicPath = path.join(__dirname, '../public')

app.use(express.static(publicPath))

io.on('connection', (socket) => {
    console.log('new ws connection!')

    socket.emit('message', 'Welcome!!')
    socket.broadcast.emit('message', 'A new user has joined')

    socket.on('sendMessage', (message, callback) => {
        const filter = new Filter()
        if (filter.isProfane(message))
            return callback('Profanity not allowed!')
        io.emit('message', message)
        callback()
    })

    socket.on('sendLocation', (coords, callback) => {
        io.emit('locationMessage', `https://google.com/maps?q=${coords.latitude},${coords.longitude}`)
        callback()
    })

    socket.on('disconnect', () => {
        io.emit('message', 'Someone disconnected')
    })
})

server.listen(port, () => {
    console.log('Server up at port:-', port)
})