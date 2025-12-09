const express = require("express");
const { getTenants } = require("../../controllers/tenants");
const router = express.Router();

router.get("/", [], getTenants);

module.exports = router;
