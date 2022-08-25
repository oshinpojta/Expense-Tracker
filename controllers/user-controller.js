const User = require("../models/user");
const jwt = require('jsonwebtoken'); //require('crypto').randomBytes(64).toString('hex') --> type in node
const bcrypt = require('bcrypt');
const saltRounds = 10;

function generateAccessToken(userId) {
    return jwt.sign(userId, process.env.TOKEN_SECRET, {});
}

exports.loginUserByEmailAndPassword = async (req, res, next) => {
    try {
        let body = req.body;
        console.log(body);
        let users = await User.findAll({where : {email : body.email}});
        if(users.length>0){
            let user = null;
            let result = false;
            for(let i=0;i<users.length;i++){
                result = await bcrypt.compare(body.password, users[i].password);
                console.log(result);
                if(result){
                    user = users[i];
                    break;
                }
            } 
            if(user!=null){
                const token = generateAccessToken(user.id);
                res.json({success : true, token : token});
            }else{
                res.json({success : false});
            }
        }else{
            res.json({success : false});
        }
    } catch (error) {
        console.log(error);
    }
}

exports.addUser = async (req, res, next ) => {
    try {

        let body = req.body;
        console.log(body);
        let passwordHash = await bcrypt.hash(body.password, saltRounds);
        let response  = await User.create({name : body.name, email : body.email, password : passwordHash});
        res.json({success : true, data : response});
        
    } catch (error) {
        res.json({success : false, data : error});
    }
}

exports.logoutUser = async (req, res, next) => {
    try{
        req.user = null;
        res.json({success : true});
    }catch(error){
        res.json({success : false});
    }
}

exports.checkUserExists = async (req, res, next) => {
    try{
        let body = req.body;
        console.log(req.body);
        let users = await User.findAll({where : {email : body.email}});
        console.log(users)
        if(users.length>0){
            res.json({success: true});
        }else{
            res.json({success : false});
        }

    }catch(error){
        console.log(error);
    }
}

exports.updateUser = async (req, res, next) => {
    try {
        
    } catch (error) {
        console.log(error);
    }
} 

exports.deleteUser = async (req, res, next) => {
    try {
        
    } catch (error) {
        console.log(error);
    }
}