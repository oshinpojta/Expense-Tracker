const Expense = require("../models/expense");

class ExpenseService{

    getAllExpensesByUser = async (userId) => {
        try{
            return await Expense.findAll({where : { userId : userId}});  
        }catch(error){
            throw error;
        }
    };
    
    getExpense = async (expenseId) => {
        try {
            return await Expense.findByPk(expenseId);
        } catch (error) {
            throw error;
        }
    }
    
    updateExpense = async (expense) => {
        try{
            let e = await Expense.findByPk(expense.id);
            if(e){
                return e.update({ 
                    amount : expense.amount, 
                    descriptiom : expense.descriptiom, 
                    category : expense.category
                });
            }
            return e;
        }catch(error){
            throw error;
        }
    }
    
    deleteExpense = async (expenseId) => {
        try {
            return await Expense.destroy({where : { id : expenseId}});
        } catch (error) {
            throw error;
        }
    }
    
    deleteAllExpensesByUser = async (userId) => {
        try {
            return await Expense.destroy({where : { userId : userId}});
        } catch (error) {
            throw error;
        }
    }

}

module.exports = ExpenseService;