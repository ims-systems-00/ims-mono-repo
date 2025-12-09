const express = require("express");
const router = express.Router();
router.use("/", require("./import"));
router.use("/", require("./schema"));
module.exports = router;
