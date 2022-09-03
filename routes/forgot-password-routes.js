const express = require("express");
const forgotPasswordRequestController = require("../controllers/forgot-password-controller");

const router = express.Router();

router.get("/resetpassword/:uuid", forgotPasswordRequestController.getPasswordRequestByUuid);

router.post("/resetpassword", forgotPasswordRequestController.addPasswordRequest);

router.post("/updatepassword/:userId", forgotPasswordRequestController.updatePassword);

module.exports = router;