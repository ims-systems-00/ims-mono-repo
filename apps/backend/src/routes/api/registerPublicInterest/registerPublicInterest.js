const express = require("express");
const router = express.Router();
const {
 createRegisterPublicInterest
} = require("../../../controllers/registerPublicInterest/registerPublicInterest");

router.post("/", createRegisterPublicInterest);

module.exports = router;
