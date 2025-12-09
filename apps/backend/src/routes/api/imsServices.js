const express = require("express");
const router = express.Router();
const {
  getAdminDashBoard,
} = require("../../controllers/dashboard");


router.get("/", [], getAdminDashBoard);

module.exports = router;
