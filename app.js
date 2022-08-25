const express = require("express");
const path = require("path");
const jwt = require('jsonwebtoken');
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const sequelize = require("./utils/database");

let authenticateToken = (req, res, next) => {
    try{
        console.log(req.headers);
        const authHeader = req.headers['authorization'];
        if(authHeader == null){
            res.json({success : false});
            return;
        }

        const token = authHeader.split(' ')[1];
    
        if (token == null){
            res.json({success : false});
            return;
        }
    
        return jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        console.log(err);
    
        if (err){
            res.json({success : false});
            return;
        }
    
        return true;
        })
    }catch(err){
        console.log(err);
        res.json({success : false});
        return;
    }
}

const userRoutes = require("./routes/user-routes");
const expenseRoutes = require("./routes/expense-routes");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, `views`,`static`)));


app.use("/user",userRoutes);
app.use("/expenses", authenticateToken, expenseRoutes); //if req.user == null redirect to login

app.use((req, res, next)=>{
    try{
        console.log(req.headers);
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