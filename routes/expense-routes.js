const express = require("express");
const expenseController = require("../controllers/expense-controller");

const router = express.Router();

router.post("/", expenseController.getAllExpensesByUser);

router.get("/:expenseId", expenseController.getExpense);

router.put("/:expenseId", expenseController.updateExpense);

router.delete("/:expenseId", expenseController.deleteExpense);

router.delete("/",)


module.exports = router;