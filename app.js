const express = require('express');
const path = require('path')
const app = express();


app.use((req, res) => {
    console.log(req.url)
    res.sendFile(path.join(__dirname, `views/${req.url}`))
})

app.get('', (req, res) => {
    res.send('<h1>This works<h1>');
})

app.listen(3000);