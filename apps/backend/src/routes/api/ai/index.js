const express = require("express");
const router = express.Router();
router.use("/", require("./gpt"));
router.use("/", require("./aiResponse"));

module.exports = router;
