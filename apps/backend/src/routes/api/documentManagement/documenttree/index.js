const express = require("express");
const router = express.Router();
router.use("/", require("./documenttree"));
module.exports = router;
