const User = require('../Models/user');
const bcrypt = require('bcrypt');


const signup = async (req, res, next) => {
    try{
        const username = req.body.username;
        const email = req.body.email;
        const phone = req.body.phone;
        const password = req.body.password;
        const check = User.findOne({ where: { email: email}})
        if(!check){

            bcrypt.hash(password, 10, async(err, hash) => {
                console.log(err);
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


module.exports = {
    signup
}