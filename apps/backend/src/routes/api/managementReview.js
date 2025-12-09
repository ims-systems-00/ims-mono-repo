const express = require("express");
const router = express.Router();

const {
  createManagementReview,
  getManagementReviews,
  getManagementReview,
  removeManagementReview,
  editManagementReview,
  addAgenda,
  addMinutes,
  removeAgenda,
  removeMinutes,
  deleteAttendee,
  addAttendee,
  completeManagementReview,
} = require("../../controllers/managementReview");

// auth middlewares ....
const { enforceRbac } = require("../../middleware/enforceRbac");
const {
  IMS_SERVICES,
  ACTIONS,
  EFFECTS,
} = require("@ims-systems-00/ims-core/lib/constants");
const {
  injectAttachmentModifierMetaData,
} = require("../../middleware/injectAttachmentModifier");
const { validate } = require("../../middleware/validator");
const validations = require("../../validations/managementReview");
const validateBody = validate("body");
router.post(
  "/",
  [
    enforceRbac({
      service: IMS_SERVICES.MANAGEMENT_REVIEW,
      action: ACTIONS.CREATE,
      effect: EFFECTS.ALLOW,
    }),
    validateBody(validations.createValidation),
    injectAttachmentModifierMetaData(["agenda", "minutes"]),
  ],
  createManagementReview
);

router.get(
  "/",
  [
    enforceRbac({
      service: IMS_SERVICES.MANAGEMENT_REVIEW,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    }),
  ],
  getManagementReviews
);

router.get(
  "/:id",
  [
    enforceRbac({
      service: IMS_SERVICES.MANAGEMENT_REVIEW,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    }),
  ],
  getManagementReview
);

router.put(
  "/:id",
  [
    enforceRbac({
      service: IMS_SERVICES.MANAGEMENT_REVIEW,
      action: ACTIONS.CREATE,
      effect: EFFECTS.ALLOW,
    }),
    validateBody(validations.updateValidation),
    injectAttachmentModifierMetaData(["agenda", "minutes"]),
  ],
  editManagementReview
);

router.delete(
  "/:id",
  [
    enforceRbac({
      service: IMS_SERVICES.MANAGEMENT_REVIEW,
      action: ACTIONS.DELETE,
      effect: EFFECTS.ALLOW,
    }),
  ],
  removeManagementReview
);

router.post(
  "/:id/attachments/agenda",
  [
    enforceRbac({
      service: IMS_SERVICES.MANAGEMENT_REVIEW,
      action: ACTIONS.CREATE,
      effect: EFFECTS.ALLOW,
    }),
  ],
  addAgenda
);

router.delete(
  "/:id/attachments/agenda/:agenda_id",
  [
    enforceRbac({
      service: IMS_SERVICES.MANAGEMENT_REVIEW,
      action: ACTIONS.DELETE,
      effect: EFFECTS.ALLOW,
    }),
  ],
  removeAgenda
);

router.post(
  "/:id/attachments/minutes",
  [
    enforceRbac({
      service: IMS_SERVICES.MANAGEMENT_REVIEW,
      action: ACTIONS.CREATE,
      effect: EFFECTS.ALLOW,
    }),
  ],
  addMinutes
);

router.delete(
  "/:id/attachments/minutes/:minute_id",
  [
    enforceRbac({
      service: IMS_SERVICES.MANAGEMENT_REVIEW,
      action: ACTIONS.DELETE,
      effect: EFFECTS.ALLOW,
    }),
  ],
  removeMinutes
);

router.post(
  "/:id/attendees",
  [
    enforceRbac({
      service: IMS_SERVICES.MANAGEMENT_REVIEW,
      action: ACTIONS.CREATE,
      effect: EFFECTS.ALLOW,
    }),
  ],
  addAttendee
);

router.delete(
  "/:id/attendees/:attendee_id",
  [
    enforceRbac({
      service: IMS_SERVICES.MANAGEMENT_REVIEW,
      action: ACTIONS.DELETE,
      effect: EFFECTS.ALLOW,
    }),
  ],
  deleteAttendee
);

router.put(
  "/:id/accomplishment",
  [
    enforceRbac({
      service: IMS_SERVICES.MANAGEMENT_REVIEW,
      action: ACTIONS.CREATE,
      effect: EFFECTS.ALLOW,
    }),
  ],
  completeManagementReview
);

module.exports = router;
