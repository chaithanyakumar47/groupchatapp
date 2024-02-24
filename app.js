const express = require('express');
var cors = require('cors');
require('dotenv').config()
const path = require('path')
const bodyParser = require('body-parser');
const app = express();
const fs = require('fs')

const sequelize = require('./util/database');
const User = require('./Models/user');
const Messages = require('./Models/messages');

const userRoutes = require('./Routes/user')

app.use(cors());
app.use(bodyParser.json({ extended: false}));

app.use('/user', userRoutes);

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
Messages.belongsTo(User);


sequelize
.sync()
.then(result => {
    app.listen(3000);
}).catch(err => console.log(err));