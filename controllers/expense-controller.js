const ExpenseService = require("../services/expense-services");

//expense needs to associate with user (one to many)--- also get userId from req.user
exports.getAllExpensesByUser = async (req, res, next) => {
    try{
        let userId = req.user.id;
        let expenses = [];
        expenses = await ExpenseService.getAllExpensesByUser(userId);
        console.log(expenses)
        res.json({success:true, data : expenses});

    }catch(err){
        console.log(err);
        res.json({success : false});
    }
};

exports.addExpense = async (req, res, next) => {

}

exports.updateExpense = async (req, res, next) => {

}

exports.deleteExpense = async (req, res, next) => {

}

exports.deleteAllExpensesByUser = async (req, res, next) => {

}
