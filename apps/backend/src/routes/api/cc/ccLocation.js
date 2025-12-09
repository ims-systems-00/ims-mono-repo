const router = require("express").Router();

const {
  createCcLocation,
  getCcLocation,
  listCcLocation,
  updateCcLocation,
  restoreCcLocation,
  softRemoveCcLocation,
  hardRemoveCcLocation,
} = require("../../../controllers/cc");

const { validate } = require("../../../middleware/validator");
const validations = require("../../../validations");
const validateBody = validate("body");
router.post(
  "/locations",
  [validateBody(validations.ccValidation.createCcLocation)],
  createCcLocation
);
router.get("/locations/:id", [], getCcLocation);
router.get("/locations/", [], listCcLocation);
router.put(
  "/locations/:id",
  [validateBody(validations.ccValidation.updateCcLocation)],
  updateCcLocation
);
router.put("/locations/:id/restore", [], restoreCcLocation);
router.delete("/locations/:id/soft", [], softRemoveCcLocation);
router.delete("/locations/:id/hard", [], hardRemoveCcLocation);

module.exports = router;
