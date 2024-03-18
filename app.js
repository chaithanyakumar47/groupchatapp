const express = require('express');

var cors = require('cors');
require('dotenv').config()
const path = require('path')
const bodyParser = require('body-parser');
const app = express();
const http = require('http');
const server = http.createServer(app)
const { Server } = require('socket.io');
const io = new Server(server);
const fs = require('fs')

const sequelize = require('./util/database');
const User = require('./Models/user');
const Messages = require('./Models/messages');
const Group = require('./Models/group');
const Archived = require('./Models/archived');
const GroupAdmin = require('./Models/groupadmin')

const cronService =  require('./services/cron');
cronService.job.start();
const userRoutes = require('./Routes/user')
const groupRoutes = require('./Routes/group');

const multer = require('multer');
const upload = multer({dest: './uploads/'})
app.post('/test/upload', upload.single('image'), (req, res) => {
    res.json(req.file)
})


io.on('connection', (socket) => {
    socket.on('room-number', room => {
        socket.join(room);
    })
    socket.on('client-send-message', (data) => {
        
        // console.log(data.message.image)
        if(data.message.image){
            console.log('Image received!!!')
        }
        io.to(data.room).emit('server-send-message', data);
         console.log('Image sent') 
    });

});

app.use(cors());
app.use(bodyParser.json({ limit: '10mb', extended: false}));


app.use('/user', userRoutes);
app.use('/group', groupRoutes)

app.get('/chat', async (req, res) => {
    try {
        const data = await fs.promises.readFile('C:/Users/kumar/Desktop/Group-chat App/messages.txt', 'utf-8')

        const formatted = data.split('\n').map(line => `<p>${line}</p>`).join('');
        console.log('Reached here')
        res.send(`<html><head><title>Chat</title><h1 style="text-align: center">Chat App</h1></head><body>${formatted}</body></html>`);
            
       
    } catch (err) {
        console.log(err);
    }
})

app.use((req, res) => {
    console.log(req.url)
    res.sendFile(path.join(__dirname, `views/${req.url}`))
})


User.hasMany(Messages);

User.belongsToMany(Group, { through: GroupAdmin});
Group.belongsToMany(User, { through: GroupAdmin})
Group.hasMany(Messages);
Messages.belongsTo(User);


sequelize
.sync()
.then(result => {
    server.listen(3000);
}).catch(err => console.log(err));