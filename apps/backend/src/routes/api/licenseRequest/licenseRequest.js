const express = require("express");
const router = express.Router();

// auth middlewares ....

const {
  createRequest,
  getRequests,
  getRequest,
  deleteRequest,
} = require("../../../controllers/licenseRequest");

const { enforceRbac } = require("../../../middleware/enforceRbac");
const {
  IMS_SERVICES,
  ACTIONS,
  EFFECTS,
} = require("@ims-systems-00/ims-core/lib/constants");

router.post("/", [], createRequest);

router.get("/", [], getRequests);

router.get("/:id", [], getRequest);

router.delete("/:id", [], deleteRequest);

module.exports = router;
