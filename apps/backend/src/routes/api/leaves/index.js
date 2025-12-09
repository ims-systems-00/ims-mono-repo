const express = require("express");

const {
  requestLeave,
  getLeaveRequests,
  getLeaveRequest,
  updateLeaveRequest,
  deleteLeaveRequest,
  handleLeaveRequest,
  handleLeaveSubmission,
  getHolidaysForYear,
} = require("../../../controllers/leaves");
const { validate } = require("../../../middleware/validator");
const validateBody = validate("body");
const { leaveValidation } = require("../../../validations/index");

const router = express.Router();
router.post("/", [], validateBody(leaveValidation.create), requestLeave);

/**
 * This route needs to be before getLeaveRequest to ensure express
 * does consider it a param
 */
router.get("/holidays", getHolidaysForYear);

router.get("/", [], getLeaveRequests);

router.get("/:id", [], getLeaveRequest);

router.put(
  "/:id",
  [],
  validateBody(leaveValidation.update),
  updateLeaveRequest
);

router.delete("/:id", [], deleteLeaveRequest);

router.patch("/:id/submission", [], handleLeaveSubmission);
router.patch(
  "/:id/evaluation",
  [],
  validateBody(leaveValidation.evaluate),
  handleLeaveRequest
);

module.exports = router;
