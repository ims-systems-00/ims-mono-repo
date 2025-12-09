const express = require("express");
const router = express.Router();
router.use("/", require("./txnEmail"));
module.exports = router;
