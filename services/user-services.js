const User = require("../models/user");

class UserService{

    findUserByEmail = async (email) => {
        try{
            return await User.findAll({where : {email : email}});
        }catch(error){
            throw error;
        }
    }
    
    addUser = async (name, email, passwordHash) => {
        try {
            return await User.create({name : name, email : email, password : passwordHash});
        } catch (error) {
            throw error;
        }
    }
    
    updateUser = async (req, res, next) => {
        try {
            
        } catch (error) {
            console.log(error);
        }
    } 
    
    deleteUser = async (req, res, next) => {
        try {
            
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = UserService;