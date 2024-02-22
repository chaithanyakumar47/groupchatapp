const express = require('express');
var cors = require('cors');
require('dotenv').config()
const path = require('path')
const bodyParser = require('body-parser');
const app = express();

const sequelize = require('./util/database');
const User = require('./Models/user');

const userRoutes = require('./Routes/user')

app.use(cors());
app.use(bodyParser.json({ extended: false}));

app.use('/user', userRoutes);

app.use((req, res) => {
    console.log(req.url)
    res.sendFile(path.join(__dirname, `views/${req.url}`))
})

app.get('', (req, res) => {
    res.send('<h1>This works<h1>');
})

sequelize
.sync()
.then(result => {
    app.listen(3000);
}).catch(err => console.log(err));