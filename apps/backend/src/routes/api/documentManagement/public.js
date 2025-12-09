const express = require("express");
const router = express.Router();
// auth middlewares ....
const {
  authSignaturePermissision,
} = require("../../../controllers/documentManagement");
router.put(
  "/:id/nodes/:node_id/signatures/:signature_id",
  authSignaturePermissision
);

module.exports = router;
