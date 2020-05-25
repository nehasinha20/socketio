const express = require('express')
const bodyParser = require('body-parser') 
const path = require('path')
const app = express()
const mongoose = require('mongoose')
const message = require('./models/message')
const server = require('http').Server(app)
const io = require('socket.io')(server)

mongoose.connect('mongodb://localhost:27017/epicchat', {useNewUrlParser:true})
mongoose.Promise = global.Promise

app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, '../dist')))

const Message = require('./models/message')

io.on("connection", (socket) => {
    let user = '';
    console.log("new user is connected");
    socket.on('new message', (data) => {
        
        const newMessage = new Message({
            _id: mongoose.Types.ObjectId(),
            message: data,
            user: user
        })
        newMessage.save().then(rec => {
            if(rec) {
                io.emit('message received', rec)
            } else {
                res.send([])
            }
        })
    })
    socket.on('new user', (data) => {
        user = data;
        console.log("new user connected");
        socket.broadcast.emit('user connected', data);
        message.find().then(rec => {
            if(rec) {
               socket.emit('all messages', rec)
            } else {
                res.send([])
            }
        })
    })
    socket.on("disconnect", () => {
        socket.broadcast.emit("user disconnected", user);
    })
})
app.get('/api/chat', (req, res) => {
    message.find().then(rec => {
        if(rec) {
            res.send(rec)
        } else {
            res.send([])
        }
    })
})

app.post('/api/chat', (req, res) => {
    const newMessage = new Message({
        _id: mongoose.Types.ObjectId(),
        message: req.body.message,
        user: 'user'
    })
    newMessage.save().then(rec => {
        if(rec) {
            res.send(rec)
        } else {
            res.send([])
        }
    })
})

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname,'..dist/index.html'))
})

server.listen(3000, () => console.log("Listening on port 3000..."))