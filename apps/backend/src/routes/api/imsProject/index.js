const express = require("express");
const router = express.Router();
router.use("/", require("./imsProject"));
router.use("/", require("./imsProjectMemberShip"));
router.use("/", require("./imsProjectWorkPackage"));
router.use("/", require("./imsProjectBudget"));
router.use("/", require("./imsProjectReport"));
router.use("/", require("./imsProjectMaterial"));
module.exports = router;
