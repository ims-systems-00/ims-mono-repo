const express = require("express");
const router = express.Router();
router.use("/", require("./invitations"));
module.exports = router;
