const User = require('../Models/user');
const Messages = require('../Models/messages');
const Group = require('../Models/group');
const groupAdmin = require('../Models/groupadmin');

const createGroup = async (req, res) => {

    try {
  
      const groupName = req.body.groupName;
  
      const newGroup = await Group.create({
        groupName: groupName 
      });
  
      // Make group creator an admin
      await newGroup.addUser(req.user, {through: {isAdmin: true}});
  
      res.status(201).json({
        message: 'Group created',
        group: newGroup
      });
  
    } catch (err) {
      console.log(err);
      res.status(400).json(err);
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
        return res.json({ message: 'You already joined this group' });
      }
  
      // Add the user to the group using belongsToMany
      await group.addUser(user, {through: {isAdmin: false}});
  
      res.status(200).json({ message: 'Joined group successfully!' });
    } catch (err) {
      console.error('Error joining group:', err);
      res.status(500).json({ message: 'Failed to join group' });
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

const getMembers = async (req, res) => {
  
  const groupId = req.params.groupId;

    try {
      const groups = await Group.findAll({
        where: {id: groupId},
        include: [{
          model: User,
          as: 'users', 
          attributes: ['id', 'username'] 
        }]
      });
      res.status(200).json(groups)


  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const makeAdmin = async (req, res) => {
  try {
    const userId = req.user.id;
    const targetUserId = req.body.userId;
    const groupId = req.body.groupId;
    const user = await groupAdmin.findOne({
      where: {
        userId: userId
      }
    });
    if (user.isAdmin === true ){
      
      const data = await groupAdmin.update(
        { isAdmin: true }, 
        {
          where: {
            userId: targetUserId,
            groupId: groupId
          }
        } 
      );
      res.status(200).json({message: 'Action Successfull'})
    } else {
      console.log('Not an Admin')
      res.status(200).json({message: 'You must be an Admin!'})
    }

    
    
  } catch (err) {
    res.status(500).json(err)
    console.log(err)
  }
}

const deleteMember = async (req, res) => {
  const userId = req.user.id;
  
  const targetUserId = req.body.userId;
  
  const groupId = req.body.groupId;
  const user = await groupAdmin.findOne({
    where: {
      userId: userId
    }
  });
  
  if (user.isAdmin === true ){
    console.log("Can be done >>>");
    await groupAdmin.destroy({
      where: {
        userId: targetUserId,
        groupId: groupId
      },
    })
    res.status(200).json({message: 'User deleted'})
  } else {
    console.log('Not an Admin')
    res.status(200).json({message: 'You must be an Admin!'})
  }
  
}
  

module.exports = {
    createGroup,
    displayGroups,
    addUserToGroup,
    showchatPage,
    getChats,
    sendMessage,
    getMembers,
    makeAdmin,
    deleteMember
}

