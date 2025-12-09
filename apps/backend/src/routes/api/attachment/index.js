const express = require("express");
const router = express.Router();
router.use("/", require("./attachment"));
module.exports = router;