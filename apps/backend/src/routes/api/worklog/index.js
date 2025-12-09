const express = require("express");

const { validate } = require("../../../middleware/validator");
const validateBody = validate("body");
const validationSchemas = require("../../../validations");

const {
  clockIn,
  pauseClock,
  clockOut,
  getWorklogs,
  getWorklog,
  getActiveWorklog,
} = require("../../../controllers/worklog");

const router = express.Router();

router.post(
  "/",
  [],
  validateBody(validationSchemas.worklogValidation.create),
  clockIn
);

/**
 * This route needs to be before getWorklog to ensure express
 * does consider it a param
 */
router.get("/active", [], getActiveWorklog);

router.get("/", [], getWorklogs);

router.get("/:id", [], getWorklog);

router.patch(
  "/",
  [],
  validateBody(validationSchemas.worklogValidation.update),
  clockOut
);

router.patch("/togglepause", [], pauseClock);

module.exports = router;
