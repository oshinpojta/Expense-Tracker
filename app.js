const express = require("express");
const path = require("path");
const jwt = require('jsonwebtoken');
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const sequelize = require("./utils/database");
const User = require("./models/user");
const Expense = require("./models/expense");
const Membership = require("./models/membership");
const userRoutes = require("./routes/user-routes");
const expenseRoutes = require("./routes/expense-routes");
const membershipRoutes = require("./routes/memebership-routes");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, `views`,`static`)));

User.hasMany(Expense);
User.hasOne(Membership);
Expense.belongsTo(User, {contraints : true, onDelete : "CASCADE"});
Membership.belongsTo(User, {contraints : true, onDelete : "CASCADE"});

let authenticateToken = async (req, res, next) => {
    try{
        //console.log(req.headers);
        const token = req.headers['authorization'];
        //console.log(req.headers);
        if (token == null){
            throw undefined;
        }
        if(req.user == null){
            const  userId = Number(jwt.verify(token, process.env.TOKEN_SECRET));
            const user = await User.findByPk(userId);
            req.user = user;
        }
        next();
    }catch(err){
        console.log(err);
        res.status(404).json({success : false, data : "Token or User Authentication Error!"});
    }
}


app.use("/user",userRoutes);
app.use("/expenses", authenticateToken, expenseRoutes); //if req.user == null redirect to login
app.use("/membership", authenticateToken, membershipRoutes); //if req.user == null redirect to login

app.use((req, res, next)=>{
    try{
        let url = req.url.split("/");
        console.log(url);
        if(url[url.length-1]==''){
            res.sendFile(path.join(__dirname,`views`,`index.html`));
        }else{
            res.sendFile(path.join(__dirname,`views`,`${url[url.length-1]}`));
        }
    }catch(error){
        res.status(404).sendFile(path.join(__dirname),`views`,`error.html`);
    }
});


app.use((req, res)=>{
    res.status(404).sendFile(path.join(__dirname),`views/error.html`);
});

sequelize.sync().then(() => {
    app.listen(4000);
}).catch(err => console.log(err));