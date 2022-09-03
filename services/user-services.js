const User = require("../models/user");

class UserService{

    getUser = async ( userId ) => {
        try {
            return User.findByPk(userId)
        } catch (error) {
            throw error;
        }
    }

    getAllUsers = async () =>{
        try{
            return await User.findAll({attributes: ['id', 'name', 'email']});
        }catch(error) {
            throw error;
        }
    }

    findUserByEmail = async (email) => {
        try{
            return await User.findOne({where : {email : email}});
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
    
    updateUserPassword = async (userId, password) => {
        try {
            
        } catch (error) {
            console.log(error);
        }
    } 
    
    deleteUser = async () => {
        try {
            
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = UserService;