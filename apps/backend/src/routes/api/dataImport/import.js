const express = require("express");
const router = express.Router();
const { startImport, validation } = require("../../../controllers/dataImport");
router.post(`/validation`, [], validation);
router.post(`/`, [], startImport);
module.exports = router;
