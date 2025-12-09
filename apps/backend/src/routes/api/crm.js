const express = require("express");
const router = express.Router();

const { initiateCrm } = require("../../controllers/customers");

// auth middlewares ....
router.post("/init", [], initiateCrm);

module.exports = router;
