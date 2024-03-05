const express = require('express');
const router = express.Router()
const userAuthentication = require('../middleware/auth');
const groupController = require('../Controller/group');

router.post('/create', userAuthentication.authenticate, groupController.createGroup);
router.get('/displayGroups', groupController.displayGroups);
router.post('/join', userAuthentication.authenticate, groupController.addUserToGroup)
router.get('/showchatPage/:groupId', groupController.showchatPage);
router.get('/members/:groupId', groupController.getMembers)
router.post('/delete', userAuthentication.authenticate, groupController.deleteMember);
router.post('/makeAdmin',userAuthentication.authenticate, groupController.makeAdmin)
router.get('/getChats/:groupId', userAuthentication.authenticate, groupController.getChats);
router.post('/sendMessage/:groupId', userAuthentication.authenticate, groupController.sendMessage)



module.exports = router