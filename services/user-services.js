const User = require("../models/user");

class UserService{

    getAllUsers = async () =>{
        try{
            return await User.findAll({attributes: ['id', 'name', 'email']});
        }catch(error) {
            throw error;
        }
    }

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