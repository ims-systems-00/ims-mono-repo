const express = require("express");
const router = express.Router();
const { validate } = require("../../middleware/validator");
const validateBody = validate("query");
const schemas = require("../../validations/index");
const { getConstants } = require("../../controllers/statics");

router.get("/", [], getConstants);

module.exports = router;
