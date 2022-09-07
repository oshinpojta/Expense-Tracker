const ExpenseService = require("../services/expense-services");
const UserService = require("../services/user-services");
const DownloadService = require("../services/download-services");
const S3Service = require("../services/s3-services");

const expenseService = new ExpenseService();
const userService = new UserService();
const downloadService = new DownloadService();
//expense needs to associate with user (one to many)--- also get userId from req.user
exports.getAllExpensesByUser = async (req, res, next) => {
    try{
        let userId = req.user.id;
        let expenseFormat = req.body.expenseFormat;
        let offset = req.body.offset;
        let limit = req.body.limit;
        let expenses = [];
        let expensePerDay = {};
        let totalExpense = 0;
        let getAllExpensesByUserByExpenseFormat = [];
        const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
        const weekdays = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

        if(expenseFormat == "day"){
            let previousdate = new Date(`${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()} 00:00:00`);
            expenses = await expenseService.getAllExpensesByUser(userId, previousdate, new Date(), limit, offset);
            getAllExpensesByUserByExpenseFormat = await expenseService.getAllExpensesByUserByExpenseFormat(userId, previousdate, new Date());
            expensePerDay[0] = {
                day : weekdays[new Date().getDay()],
                expenses : expenses,
                date : new Date().getDate(),
                month : months[new Date().getMonth()+1],
                year : new Date().getFullYear()
            }

        }else if(expenseFormat == "week"){
            let date = new Date().getDate()-7;
            let month = new Date().getMonth();
            if(date < 1){
                date = 30-date;
                month = month-1;
            }
            if(month<0){
                month = 11;
            }
            let previousdate = new Date(`${new Date().getFullYear()}-${month}-${date} 00:00:00`);
            expenses = await expenseService.getAllExpensesByUser(userId, previousdate, new Date(), limit, offset);
            getAllExpensesByUserByExpenseFormat = await expenseService.getAllExpensesByUserByExpenseFormat(userId, previousdate, new Date());
            for(let i=0;i<expenses.length;i++){
                if(!expensePerDay[`${expenses[i].createdAt.getDate()}-${expenses[i].createdAt.getMonth()}-${expenses[i].createdAt.getFullYear()}`]){
                    expensePerDay[`${expenses[i].createdAt.getDate()}-${expenses[i].createdAt.getMonth()}-${expenses[i].createdAt.getFullYear()}`] = {
                        day : weekdays[expenses[i].createdAt.getDay()],
                        expenses : [expenses[i]],
                        date : expenses[i].createdAt.getDate(),
                        month : months[expenses[i].createdAt.getMonth()],
                        year : expenses[i].createdAt.getFullYear()
                    }
                }else{
                    expensePerDay[`${expenses[i].createdAt.getDate()}-${expenses[i].createdAt.getMonth()}-${expenses[i].createdAt.getFullYear()}`].expenses.push(expenses[i]);
                }
            }

        }else if(expenseFormat == "month"){
            let month = new Date().getMonth()-1;
            if(month<0){
                month = 11;
            }
            let previousdate = new Date(`${new Date().getFullYear()}-${month}-${new Date().getDate()} 00:00:00`);
            expenses = await expenseService.getAllExpensesByUser(userId, previousdate, new Date(), limit, offset);
            getAllExpensesByUserByExpenseFormat = await expenseService.getAllExpensesByUserByExpenseFormat(userId, previousdate, new Date());
            for(let i=0;i<expenses.length;i++){
                if(!expensePerDay[`${expenses[i].createdAt.getDate()}-${expenses[i].createdAt.getMonth()}-${expenses[i].createdAt.getFullYear()}`]){
                    expensePerDay[`${expenses[i].createdAt.getDate()}-${expenses[i].createdAt.getMonth()}-${expenses[i].createdAt.getFullYear()}`] = {
                        day : weekdays[expenses[i].createdAt.getDay()],
                        expenses : [expenses[i]],
                        date : expenses[i].createdAt.getDate(),
                        month : months[expenses[i].createdAt.getMonth()],
                        year : expenses[i].createdAt.getFullYear()
                    }
                }else{
                    expensePerDay[`${expenses[i].createdAt.getDate()}-${expenses[i].createdAt.getMonth()}-${expenses[i].createdAt.getFullYear()}`].expenses.push(expenses[i]);
                }
            }

        }else if(expenseFormat == "year"){

            let previousdate = new Date(`${new Date().getFullYear()-1}-${new Date().getMonth()}-${new Date().getDate()} 00:00:00`);
            expenses = await expenseService.getAllExpensesByUser(userId, previousdate, new Date(), limit, offset);
            getAllExpensesByUserByExpenseFormat = await expenseService.getAllExpensesByUserByExpenseFormat(userId, previousdate, new Date());
            for(let i=0;i<expenses.length;i++){
                if(!expensePerDay[`${expenses[i].createdAt.getDate()}-${expenses[i].createdAt.getMonth()}-${expenses[i].createdAt.getFullYear()}`]){
                    expensePerDay[`${expenses[i].createdAt.getDate()}-${expenses[i].createdAt.getMonth()}-${expenses[i].createdAt.getFullYear()}`] = {
                        day : weekdays[expenses[i].createdAt.getDay()],
                        expenses : [expenses[i]],
                        date : expenses[i].createdAt.getDate(),
                        month : months[expenses[i].createdAt.getMonth()],
                        year : expenses[i].createdAt.getFullYear()
                    }
                }else{
                    expensePerDay[`${expenses[i].createdAt.getDate()}-${expenses[i].createdAt.getMonth()}-${expenses[i].createdAt.getFullYear()}`].expenses.push(expenses[i]);
                }
            }
        }
        
        for(let i=0;i<getAllExpensesByUserByExpenseFormat.length;i++){
            totalExpense += getAllExpensesByUserByExpenseFormat[i].amount;
        }
        //console.log(expensePerDay);
        let expenseCount = await expenseService.getCount(userId);
        res.json({success:true, data : expensePerDay, expenseCount : expenseCount, totalExpense : totalExpense});

    }catch(err){
        console.log(err);
        res.status(404).json({success : false});
    }
};

exports.getAllExpensesByAll = async (req, res, next) => {
    try {
        let users = await userService.getAllUsers();
        let leaderboard = [];
        for(let i=0;i<users.length;i++){
            let expenses = await expenseService.getAllExpensesByUserNoQuery(users[i].id);
            let totalExpense = 0;
            for(let j=0;j<expenses.length;j++){
                totalExpense += expenses[j].amount;
            }
            let userObj = {
                user : users[i],
                expenses : expenses,
                totalExpense : totalExpense
            }
            leaderboard.push(userObj);
        }
        res.json({success : true, data : leaderboard});
    } catch (error) {
        res.json(500).json({success : false, data : error});
    }
}

exports.getDownloadExpense = async (req, res, next) => {
    try {
        const expenses = await req.user.getExpenses();
        const stringfiedExpenses = JSON.stringify(expenses);
        let filename = `${new Date()}.txt`;
        const filenameDir = `Expenses${req.user.id}/${filename}`;
        let fileURL = await S3Service.uploadFile(stringfiedExpenses, filenameDir);
        let savedDownload = await downloadService.addDownload(req.user.id, filename, fileURL.Location);
        res.json({ data : savedDownload, success : true});
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ success : false, error : error, fileURL : ""});
    }
}

exports.getAllDownlloadFileURLS = async (req, res, next) => {
    try {
        let downloads = await downloadService.getAllDownloads(req.user.id);
        res.json({ success : true, data : downloads});
    } catch (error) {
        console.log(error);
        res.status(500).json({ success : false, error : error});
    }
}

exports.addExpense = async (req, res, next) => {
    try {
        let expense = req.body;
        //console.log(expense);
        let result = await req.user.createExpense({ 
            amount : expense.amount, 
            description : expense.description, 
            category : expense.category
        });
        //console.log(result);
        res.json({success : true, data : result});
        
    } catch (error) {
        console.log(error);
        res.status(404).json({ success : false });
    }
}

exports.updateExpense = async (req, res, next) => {
    try {
        let expense = req.body;
        //console.log(expense);
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
