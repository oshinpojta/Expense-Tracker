const ExpenseService = require("../services/expense-services");


const expenseService = new ExpenseService();
//expense needs to associate with user (one to many)--- also get userId from req.user
exports.getAllExpensesByUser = async (req, res, next) => {
    try{
        let userId = req.user.id;
        //console.log(userId);
        let expenses = [];
        expenses = await expenseService.getAllExpensesByUser(userId);
        //console.log(expenses)
        res.json({success:true, data : expenses});

    }catch(err){
        console.log(err);
        res.status(404).json({success : false});
    }
};

exports.addExpense = async (req, res, next) => {
    try {
        let expense = req.body;
        //console.log(expense);
        let result = await req.user.createExpense({ 
            amount : expense.amount, 
            description : expense.description, 
            category : expense.category
        });
        console.log(result);
        res.json({success : true, data : result});
        
    } catch (error) {
        console.log(error);
        res.status(404).json({ success : false });
    }
}

exports.updateExpense = async (req, res, next) => {
    try {
        let expense = req.body;
        let result = await expenseService.updateExpense(expense);
        //console.log(result);
        res.json({success : true, data : result});
    } catch (error) {
        console.log(error);
        res.status(404).json({success : false});
    }

}

exports.deleteExpense = async (req, res, next) => {
    try {
        let expenseId = req.params.expenseId;
        let result = await expenseService.deleteExpense(expenseId);
        res.json({success : true, data : result});
    } catch (error) {
        console.log(error);
        res.status(401).json({success : false});
    }
}

exports.deleteAllExpensesByUser = async (req, res, next) => {
    try {
        let userId = req.user.id;
        let result = await expenseService.deleteAllExpensesByUser(userId);
        //console.log(result);
        res.json({success : true, data : result});
    } catch (error) {
        console.log(error);
        res.status(401).json({success : false});
    }
}
