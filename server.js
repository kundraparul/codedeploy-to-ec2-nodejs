const express = require('express')
const app = express()
const http = require('http').createServer(app)

const PORT = process.env.PORT || 80

// ----------------------------
// ADDED: Redirect HTTPS to HTTP
app.use((req, res, next) => {
    if (req.secure || req.headers['x-forwarded-proto'] === 'https') {
        return res.redirect('http://' + req.headers.host + req.url)
    }
    next()
})
// ----------------------------

app.use(express.static(__dirname + '/public'))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

// Socket.IO
const io = require('socket.io')(http)

io.on('connection', (socket) => {
    console.log('Connected...')
    socket.on('message', (msg) => {
        socket.broadcast.emit('message', msg)
    })
})

// Start server
http.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})
