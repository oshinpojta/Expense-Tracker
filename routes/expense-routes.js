const express = require("express");
const expenseController = require("../controllers/expense-controller");

const router = express.Router();

router.post("/get-all",  expenseController.getAllExpensesByUser);

router.get("/leaderboard",  expenseController.getAllExpensesByAll);

router.get("/download", expenseController.getDownloadExpense);

router.get("/file-urls", expenseController.getAllDownlloadFileURLS);

router.post("/add", expenseController.addExpense);

router.put("/update", expenseController.updateExpense);

router.delete("/delete-all", expenseController.deleteAllExpensesByUser);

router.delete("/:expenseId", expenseController.deleteExpense);


module.exports = router;