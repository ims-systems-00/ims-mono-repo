const express = require("express");
const router = express.Router();
router.use("/", require("./partnershipProgram"));
router.use("/", require("./adminPartnershipProgram"))
module.exports = router;