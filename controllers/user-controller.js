const User = require("../models/user");
const bcrypt = require('bcrypt');
const saltRounds = 10;

exports.getUserByEmailAndPassword = async (req, res, next) => {
    try {
        let body = req.body;
        console.log(body);
        let users = await User.findAll({where : {email : body.email}});
        if(users.length>0){
            let result = false;
            for(let i=0;i<users.length;i++){
                result = await bcrypt.compare(body.password, users[i].password);
                console.log(result);
                if(result){
                    res.json({success: true, data : users[i].id});
                    return;
                }
            } 
            res.json({success : false});
            
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