const router = require("express").Router();

const {
  createCcCalculation,
  getCcCalculation,
  listCcCalculation,
  updateCcCalculation,
  restoreCcCalculation,
  softRemoveCcCalculation,
  hardRemoveCcCalculation,
} = require("../../../controllers/cc");

const { validate } = require("../../../middleware/validator");
const validations = require("../../../validations");
const validateBody = validate("body");
router.post(
  "/calculations",
  [validateBody(validations.ccValidation.createCcCalculation)],
  createCcCalculation
);
router.get("/calculations/:id", [], getCcCalculation);
router.get("/calculations/", [], listCcCalculation);
router.put(
  "/calculations/:id",
  [validateBody(validations.ccValidation.updateCcCalculation)],
  updateCcCalculation
);
router.put("/calculations/:id/restore", [], restoreCcCalculation);
router.delete("/calculations/:id/soft", [], softRemoveCcCalculation);
router.delete("/calculations/:id/hard", [], hardRemoveCcCalculation);

module.exports = router;
