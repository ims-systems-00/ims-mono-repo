const express = require("express");
const router = express.Router();
router.use("/", require("./repository"));
router.use("/", require("./documenttree"));
router.use("/", require("./checks"));
module.exports = router;
