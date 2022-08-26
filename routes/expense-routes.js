const express = require("express");
const expenseController = require("../controllers/expense-controller");
const jwtAuth = require("../middlewares/jwt-auth"); 

const router = express.Router();

router.get("/get-all",  expenseController.getAllExpensesByUser);

router.post("/add", expenseController.addExpense);

router.put("/:expenseId", expenseController.updateExpense);

router.delete("/:expenseId", expenseController.deleteExpense);

router.delete("/delete-all")


module.exports = router;