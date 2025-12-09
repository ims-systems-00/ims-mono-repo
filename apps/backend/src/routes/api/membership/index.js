const express = require("express");
const router = express.Router();
router.use("/", require("./membership"));
module.exports = router;