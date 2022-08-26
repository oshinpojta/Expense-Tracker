const Expense = require("../models/expense");

class ExpenseService{

    getAllExpensesByUser = async (userId) => {
        try{
            return Expense.findAll({where : { userId : userId}});  
        }catch(err){
            throw err;
        }
    };
    
    getExpense = async (req, res, next) => {
    
    }
    
    updateExpense = async (req, res, next) => {
    
    }
    
    deleteExpense = async (req, res, next) => {
    
    }
    
    deleteAllExpensesByUser = async (req, res, next) => {
    
    }

}

module.exports = ExpenseService;