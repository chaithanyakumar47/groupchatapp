const User = require('../Models/user');
const Messages = require('../Models/messages');
const Group = require('../Models/group');

const createGroup = async (req, res) => {
    try {

        const groupName = req.body.groupName;
        const newGroup = await Group.create({
            groupName: groupName
        });
        await req.user.addGroup(newGroup);
        res.status(201).json({ message: 'Group created', group: newGroup});
    } catch (err) {
        res.status(400).json(err)
        console.log(err);
    }


}

const displayGroups = async (req, res) => {
    try {
        const groups = await Group.findAll({
            include: [{
              model: User,
              as: 'users', // Use the defined alias for 'users' association
              attributes: ['id', 'username'] // Specify which user attributes to include
            }]
          });
        res.status(200).json(groups)
    } catch (err) {
        res.status(400).json(err);
        console.log(err);
    }
}

const addUserToGroup = async (req, res, next) => {
    try {
      const groupId = req.body.groupId // Extract group ID and username to add
      const username = req.user.username;
  
      // Find the Group and User based on provided IDs
      const [group, user] = await Promise.all([
        Group.findByPk(groupId),
        User.findOne({ where: { username } }),
      ]);
  

  
      // Check if user is already in the group
      const isMember = await group.hasUser(user); // Utilize belongsToMany association method
      if (isMember) {
        return res.json({ message: 'User is already in the group' });
      }
  
      // Add the user to the group using belongsToMany
      await group.addUser(user);
  
      res.status(200).json({ message: 'User added to the group successfully!' });
    } catch (err) {
      console.error('Error adding user to group:', err);
      res.status(500).json({ message: 'Failed to add user to group' });
    }
  };

const showchatPage = async (req, res) => {
    try {
        // const userId = req.user.id;
        // const groupId = req.params.groupId;
        // const chats = await Messages.findAll({
        //     where: {
        //         groupId: groupId
        //     }
        // })
        res.sendFile('C:/Users/kumar/Desktop/Group-chat App/views/Chat/groupChat.html')
        // res.status(200).json(chats);

    } catch (err) {
        res.status(404).json(err);
        console.log(err)
    }
}

const getChats = async (req, res) => {
    try {
        
        const groupId = req.params.groupId;
        const data = await Messages.findAll({
            where: {
                groupId: groupId
            },
            include: {
                model: User,
                attributes: ['username'], 
              }
        })
        res.status(201).json(data);
    } catch (err) {
        res.status(400).json(err);
    }
}

const sendMessage = async (req, res) => {
    try {
        const userId = req.user.id;
        const groupId = req.params.groupId
        const message = req.body.message;
        const data = await Messages.create({ message: message, userId: userId, groupId: groupId});
        res.status(201).json(data);
    } catch (err) {
        res.json(err);
        console.log(err)
    }


}
  

module.exports = {
    createGroup,
    displayGroups,
    addUserToGroup,
    showchatPage,
    getChats,
    sendMessage
}

