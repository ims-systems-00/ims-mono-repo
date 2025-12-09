const express = require("express");
const router = express.Router();
const { getModuleSchema } = require("../../../controllers/dataImport");
let path = "/schema";
router.get(`${path}/:module`, [], getModuleSchema);
module.exports = router;
