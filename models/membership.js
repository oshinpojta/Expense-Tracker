const Sequelize = require("sequelize");
const sequelize = require("../utils/database");

const Membership = sequelize.define("membership",{
    id : {
        type : Sequelize.INTEGER,
        autoIncrement : true,
        allowNull : false,
        primaryKey : true
    },
    orderId : {
        type : Sequelize.STRING
    },
    paymentId : {
        type : Sequelize.STRING
    },
    signature : {
        type : Sequelize.STRING
    },
    isMember : {
        type : Sequelize.BOOLEAN,
        allowNull : false,
        default : false
    }
});


module.exports = Membership;