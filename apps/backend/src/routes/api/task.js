const express = require("express");
const router = express.Router();
const {
  createTask,
  getTasks,
  getTask,
  updateTask,
  completeTask,
  acceptTask,
  deleteTask,
  deleteAttachment,
  authPersonalization,
  topTaskAnalytics,
} = require("../../controllers/task");

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
const validations = require("../../validations/taskManager");
const validateBody = validate("body");

router.post(
  "/",
  [
    // enforceRbac({
    //   service: IMS_SERVICES.TASK_MANAGER,
    //   action: ACTIONS.CREATE,
    //   effect: EFFECTS.ALLOW,
    // }),
    validateBody(validations.createValidation),
    injectAttachmentModifierMetaData("attachments"),

  ],
  createTask
);

router.get(
  "/",
  [
    // enforceRbac({
    //   service: IMS_SERVICES.TASK_MANAGER,
    //   action: ACTIONS.READ,
    //   effect: EFFECTS.ALLOW,
    // }),
  ],
  getTasks
);

router.get(
  "/analytics/toptasks",
  [
    // enforceRbac({
    //   service: IMS_SERVICES.TASK_MANAGER,
    //   action: ACTIONS.READ,
    //   effect: EFFECTS.ALLOW,
    // }),
  ],
  topTaskAnalytics
);

router.get(
  "/:id",
  [
    // enforceRbac({
    //   service: IMS_SERVICES.TASK_MANAGER,
    //   action: ACTIONS.READ,
    //   effect: EFFECTS.ALLOW,
    // }),
  ],
  getTask
);

router.put(
  "/:id",
  [
    // enforceRbac({
    //   service: IMS_SERVICES.TASK_MANAGER,
    //   action: ACTIONS.CREATE,
    //   effect: EFFECTS.ALLOW,
    // }),
    validateBody(validations.updateValidation),
    injectAttachmentModifierMetaData("attachments"),
  ],
  updateTask
);

router.put(
  "/:id/assignments",
  [
    // enforceRbac({
    //   service: IMS_SERVICES.TASK_MANAGER,
    //   action: ACTIONS.CREATE,
    //   effect: EFFECTS.ALLOW,
    // }),
  ],
  acceptTask
);

router.put(
  "/:id/accomplishment",
  [
    // enforceRbac({
    //   service: IMS_SERVICES.TASK_MANAGER,
    //   action: ACTIONS.CREATE,
    //   effect: EFFECTS.ALLOW,
    // }),
  ],
  completeTask
);

router.delete(
  "/:id",
  [
    // enforceRbac({
    //   service: IMS_SERVICES.TASK_MANAGER,
    //   action: ACTIONS.DELETE,
    //   effect: EFFECTS.ALLOW,
    // }),
  ],
  deleteTask
);

router.delete(
  "/:id/attachments/:attachment_id",
  [
    // enforceRbac({
    //   service: IMS_SERVICES.TASK_MANAGER,
    //   action: ACTIONS.DELETE,
    //   effect: EFFECTS.ALLOW,
    // }),
  ],
  deleteAttachment
);

module.exports = router;
