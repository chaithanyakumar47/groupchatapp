const express = require('express');
const router = express.Router()
const userAuthentication = require('../middleware/auth');
const userController = require('../Controller/user');

router.post('/signup', userController.signup);
router.post('/login', userController.login)
router.post('/chat', userAuthentication.authenticate, userController.chat)
router.get('/getChats/:chatId', userAuthentication.authenticate, userController.getChats)
module.exports = router;
