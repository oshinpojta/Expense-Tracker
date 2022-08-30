const express = require("express");
const membershipController = require("../controllers/membership-controller");

const router = express.Router();

router.get("/get",  membershipController.getMembershipByUser);

router.post("/create-order", membershipController.createOrder);

router.post("/add", membershipController.addMembership);

router.put("/update", membershipController.addMembership);

router.delete("/delete", membershipController.deleteMembership);


module.exports = router;