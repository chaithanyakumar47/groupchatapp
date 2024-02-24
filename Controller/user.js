const User = require('../Models/user');
const Messages = require('../Models/messages');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs')


function generateAccessToken(id, name) {    
    return jwt.sign({ userId: id, name: name }, 'eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTcwNTEzOTk0OSwiaWF0IjoxNzA1MTM5OTQ5fQ.u17qfbQbdIbKM0Cw4yx_qqxu_SyYWNaFsN5ia1tsOdc')

}


const signup = async (req, res, next) => {
    try{
        const username = req.body.username;
        const email = req.body.email;
        const phone = req.body.phone;
        const password = req.body.password;
        const check = await User.findOne({ where: { email: email}})
        
        if(!check){
            bcrypt.hash(password, 10, async(err, hash) => {
                const data = await User.create( { username: username, email: email, phone: phone, password: hash });
                res.status(201).json(data);
            })
        }
        else {
            res.status(400).json({ err: "Email already registered, Please log in" })
        }

        
        
    } catch(err) {
        res.status(403).json({ err: err});
    }
}

const login = async (req, res, next) => {
    try{
        const email = req.body.email;
        const password = req.body.password;
        const emailCheck = await User.findAll({ where : {email: email}});
        if (emailCheck.length > 0){
            bcrypt.compare(password, emailCheck[0].password, (err, result) => {
                if(err) {
                    throw new Error('Something went wrong')
                }
                if(result === true) {
                    const content = `${emailCheck[0].username} joined\n`
                    fs.writeFileSync('C:/Users/kumar/Desktop/Group-chat App/messages.txt',content, { flag: 'a'})
                    res.status(200).json({ status: true, message: 'Logged in Successfully', token: generateAccessToken(emailCheck[0].id, emailCheck[0].username)});
                }
                else {
                    return res.json({ status: false, message: 'Password is incorrect'})
                }
            })
        }else {
            res.json({ status: false, message: 'User does not exist'})
        }
        
    } 
    catch(err) {
        res.status(404).json({err: err});
    }    
}

const chat = async (req, res) => {
    try {
        const userId = req.user.id;
        const message = req.body.message;
        const data = await Messages.create({ message: message, userId: userId});
        res.status(201).json(data);
    } catch (err) {
        res.json(err);
        console.log(err)
    }


}

const getChats = async (req, res) => {
    try {
        const data = await Messages.findAll({
            include: {
              model: User,
              attributes: ['username'], 
            },
          });
          
        res.status(200).json(data)
    } catch (err) {
        res.status(404).json(err)
        console.log(err);
    }
    
}








module.exports = {
    signup,
    login,
    chat,
    getChats
}