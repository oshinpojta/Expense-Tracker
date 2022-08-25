const express = require("express");
const userController = require("../controllers/user-controller");

const router = express.Router();

router.post("/login", userController.loginUserByEmailAndPassword);

router.post("/verify-email",userController.checkUserExists);

router.post("/logout", userController.logoutUser);

router.post("/add-user",userController.addUser);

router.put("/update-user",userController.updateUser);

router.delete("/delete-user",userController.deleteUser);

module.exports = router;