const Sequelize = require("sequelize");
const sequelize = require("../utils/database");

const ForgotPasswordRequest = sequelize.define("forgotpasswordrequest",{
    id : {
        type : Sequelize.INTEGER,
        autoIncrement : true,
        allowNull : false,
        primaryKey : true
    },
    userId : {
        type : Sequelize.INTEGER,
        allowNull : false
    },
    uuid : {
        type : Sequelize.STRING,
        allowNull : false
    },
    isActive : {
        type : Sequelize.BOOLEAN,
        allowNull : false,
        default : true
    }
});


module.exports = ForgotPasswordRequest;