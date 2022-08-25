const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const sequelize = require("./utils/database");

const userRoutes = require("./routes/user-routes");
const expenseRoutes = require("./routes/expense-routes");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, `views/static`)));


app.use("/user",userRoutes);
app.use("/expenses",expenseRoutes); //if req.user == null redirect to login

app.use((req, res, next)=>{
    try{
        let url = req.url.split("/");
        console.log(url);
        console.log(req.user);
        if((url[url.length-1] == '' || url[url.length-1] == 'index.html' ) && req.user == null){
            res.sendFile(path.join(__dirname,`views/login.html`));
        }else{
            res.sendFile(path.join(__dirname,`views/${url[url.length-1]}`));
        }
    }catch(error){
        res.status(404).sendFile(path.join(__dirname),`views/error.html`);
    }
});


app.use((req, res)=>{
    res.status(404).json({success : false});
});

sequelize.sync().then(() => {
    app.listen(4000);
}).catch(err => console.log(err));