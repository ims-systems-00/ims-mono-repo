const express = require("express");
const router = express.Router();

const {
  createCompliant,
  getCompliants,
  getCompliant,
  updateCompliant,
  deleteCompliant,
  createCCQTool,
  getCQCTool,
  getCQCControl,
  updateCQCControl,
  grantCCQToolAccess,
  addEvidence,
  removeEvidence,
  revokeCCQToolAccess,
  getCQCOverview,
  updateCQCRatings,
  addComment,
  removeComment,
  updateComment,
  getCQCOverviews,
  CQCNotice,
  createCQCReport,
  getCQCReports,
  getCQCReport,
  resendCQCReport,
  deleteCQCReport,
  createCQCWhistleBlow,
  getCQCWhistleBlows,
  getCQCWhistleBlow,
  updateCQCWhistleBlow,
  deleteWhistleBlow,
  getCompliantsCSV,
  getCQCWhistleBlowsCSV,
  createCQCSignificantEvent,
  getCQCSignificantEvents,
  getCQCSignificantEvent,
  updateCQCSignificantEvent,
  deleteSignificantEvent,
  addSignificantEventAction,
  updateSignificantEventAction,
  removeSignificantEventAction,
  createCQCSafeGuarding,
  getCQCSafeGuardings,
  getCQCSafeGuarding,
  updateCQCSafeGuarding,
  deleteSafeGuarding,
  deleteSafeGuardingAttachment,
  deleteSignificantEventAttachment,
  getCQCSignificantEventsCSV,
  deleteCompliantAttachment,
  authToolGrantPermision,
} = require("../../controllers/cqc");

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

router.post("/", [authToolGrantPermision], createCCQTool);

router.post(
  "/controls",
  [
    authToolGrantPermision,
    enforceRbac({
      service: IMS_SERVICES.CQC,
      action: ACTIONS.CREATE,
      effect: EFFECTS.ALLOW,
    }),
  ],
  grantCCQToolAccess
);

router.get(
  "/controls",
  [
    enforceRbac({
      service: IMS_SERVICES.CQC,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    }),
  ],
  getCQCTool
);

router.get(
  "/controls/:id",
  [
    enforceRbac({
      service: IMS_SERVICES.CQC,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    }),
  ],
  getCQCControl
);

router.put(
  "/controls/:id",
  [
    enforceRbac({
      service: IMS_SERVICES.CQC,
      action: ACTIONS.UPDATE,
      effect: EFFECTS.ALLOW,
    }),
  ],
  updateCQCControl
);

router.delete(
  "/controls",
  [
    // enforceRbac({
    //     service: IMS_SERVICES.CQC,
    //     action: ACTIONS.DELETE,
    //     effect: EFFECTS.ALLOW
    // })
  ],
  revokeCCQToolAccess
);

router.get(
  "/overviews",
  [
    enforceRbac({
      service: IMS_SERVICES.CQC,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    }),
  ],
  getCQCOverviews
);

router.get(
  "/overviews/:id",
  [
    enforceRbac({
      service: IMS_SERVICES.CQC,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    }),
  ],
  getCQCOverview
);

router.put(
  "/overviews",
  [
    enforceRbac({
      service: IMS_SERVICES.CQC,
      action: ACTIONS.UPDATE,
      effect: EFFECTS.ALLOW,
    }),
  ],
  updateCQCRatings
);

router.post(
  "/notice",
  [
    enforceRbac({
      service: IMS_SERVICES.CQC,
      action: ACTIONS.CREATE,
      effect: EFFECTS.ALLOW,
    }),
  ],
  CQCNotice
);

router.post(
  "/controls/:id/evidences",
  [
    enforceRbac({
      service: IMS_SERVICES.CQC,
      action: ACTIONS.CREATE,
      effect: EFFECTS.ALLOW,
    }),
    injectAttachmentModifierMetaData("evidences"),
  ],
  addEvidence
);

router.delete(
  "/controls/:id/evidences/:evidence_id",
  [
    enforceRbac({
      service: IMS_SERVICES.CQC,
      action: ACTIONS.DELETE,
      effect: EFFECTS.ALLOW,
    }),
  ],
  removeEvidence
);

router.post(
  "/controls/:id/comments",
  [
    enforceRbac({
      service: IMS_SERVICES.CQC,
      action: ACTIONS.CREATE,
      effect: EFFECTS.ALLOW,
    }),
  ],
  addComment
);

router.put(
  "/controls/:id/comments/:comment_id",
  [
    enforceRbac({
      service: IMS_SERVICES.CQC,
      action: ACTIONS.UPDATE,
      effect: EFFECTS.ALLOW,
    }),
  ],
  updateComment
);

router.delete(
  "/controls/:id/comments/:comment_id",
  [
    enforceRbac({
      service: IMS_SERVICES.CQC,
      action: ACTIONS.DELETE,
      effect: EFFECTS.ALLOW,
    }),
  ],
  removeComment
);

router.post(
  "/compliants",
  [
    enforceRbac({
      service: IMS_SERVICES.CQC,
      action: ACTIONS.CREATE,
      effect: EFFECTS.ALLOW,
    }),
    injectAttachmentModifierMetaData("attachments"),
  ],
  createCompliant
);

router.get(
  "/compliants",
  [
    enforceRbac({
      service: IMS_SERVICES.CQC,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    }),
  ],
  getCompliants
);

router.get(
  "/compliants/:id",
  [
    enforceRbac({
      service: IMS_SERVICES.CQC,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    }),
  ],
  getCompliant
);

router.put(
  "/compliants/:id",
  [
    enforceRbac({
      service: IMS_SERVICES.CQC,
      action: ACTIONS.UPDATE,
      effect: EFFECTS.ALLOW,
    }),
    injectAttachmentModifierMetaData("attachments"),
  ],
  updateCompliant
);

router.delete(
  "/compliants/:id",
  [
    enforceRbac({
      service: IMS_SERVICES.CQC,
      action: ACTIONS.DELETE,
      effect: EFFECTS.ALLOW,
    }),
  ],
  deleteCompliant
);

router.delete(
  "/compliants/:id/attachments/:attachment_id",
  [
    enforceRbac({
      service: IMS_SERVICES.CQC,
      action: ACTIONS.DELETE,
      effect: EFFECTS.ALLOW,
    }),
  ],
  deleteCompliantAttachment
);

router.post(
  "/reports",
  [
    enforceRbac({
      service: IMS_SERVICES.CQC,
      action: ACTIONS.CREATE,
      effect: EFFECTS.ALLOW,
    }),
    injectAttachmentModifierMetaData("attachments"),
  ],
  createCQCReport
);

router.get(
  "/reports",
  [
    enforceRbac({
      service: IMS_SERVICES.CQC,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    }),
  ],
  getCQCReports
);

router.get(
  "/reports/:id",
  [
    enforceRbac({
      service: IMS_SERVICES.CQC,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    }),
  ],
  getCQCReport
);

router.put(
  "/reports/:id",
  [
    enforceRbac({
      service: IMS_SERVICES.CQC,
      action: ACTIONS.UPDATE,
      effect: EFFECTS.ALLOW,
    }),
  ],
  resendCQCReport
);

router.delete(
  "/reports/:id",
  [
    enforceRbac({
      service: IMS_SERVICES.CQC,
      action: ACTIONS.DELETE,
      effect: EFFECTS.ALLOW,
    }),
  ],
  deleteCQCReport
);

router.post(
  "/whistleblows",
  [
    enforceRbac({
      service: IMS_SERVICES.CQC,
      action: ACTIONS.CREATE,
      effect: EFFECTS.ALLOW,
    }),
  ],
  createCQCWhistleBlow
);

router.get(
  "/whistleblows",
  [
    enforceRbac({
      service: IMS_SERVICES.CQC,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    }),
  ],
  getCQCWhistleBlows
);

router.get(
  "/whistleblows/:id",
  [
    enforceRbac({
      service: IMS_SERVICES.CQC,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    }),
  ],
  getCQCWhistleBlow
);

router.put(
  "/whistleblows/:id",
  [
    enforceRbac({
      service: IMS_SERVICES.CQC,
      action: ACTIONS.UPDATE,
      effect: EFFECTS.ALLOW,
    }),
  ],
  updateCQCWhistleBlow
);

router.delete(
  "/whistleblows/:id",
  [
    enforceRbac({
      service: IMS_SERVICES.CQC,
      action: ACTIONS.DELETE,
      effect: EFFECTS.ALLOW,
    }),
  ],
  deleteWhistleBlow
);

router.post(
  "/safeguardings",
  [
    enforceRbac({
      service: IMS_SERVICES.CQC,
      action: ACTIONS.CREATE,
      effect: EFFECTS.ALLOW,
    }),
    injectAttachmentModifierMetaData("attachments"),
  ],
  createCQCSafeGuarding
);

router.get(
  "/safeguardings",
  [
    enforceRbac({
      service: IMS_SERVICES.CQC,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    }),
  ],
  getCQCSafeGuardings
);

router.get(
  "/safeguardings/:id",
  [
    enforceRbac({
      service: IMS_SERVICES.CQC,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    }),
  ],
  getCQCSafeGuarding
);

router.put(
  "/safeguardings/:id",
  [
    enforceRbac({
      service: IMS_SERVICES.CQC,
      action: ACTIONS.UPDATE,
      effect: EFFECTS.ALLOW,
    }),
    injectAttachmentModifierMetaData("attachments"),
  ],
  updateCQCSafeGuarding
);

router.delete(
  "/safeguardings/:id",
  [
    enforceRbac({
      service: IMS_SERVICES.CQC,
      action: ACTIONS.DELETE,
      effect: EFFECTS.ALLOW,
    }),
  ],
  deleteSafeGuarding
);

router.delete(
  "/safeguardings/:id/attachments/:attachment_id",
  [
    enforceRbac({
      service: IMS_SERVICES.CQC,
      action: ACTIONS.DELETE,
      effect: EFFECTS.ALLOW,
    }),
  ],
  deleteSafeGuardingAttachment
);

router.post(
  "/significantevents",
  [
    enforceRbac({
      service: IMS_SERVICES.CQC,
      action: ACTIONS.CREATE,
      effect: EFFECTS.ALLOW,
    }),
    injectAttachmentModifierMetaData("attachments"),
  ],
  createCQCSignificantEvent
);

router.get(
  "/significantevents",
  [
    enforceRbac({
      service: IMS_SERVICES.CQC,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    }),
  ],
  getCQCSignificantEvents
);

router.get(
  "/significantevents/:id",
  [
    enforceRbac({
      service: IMS_SERVICES.CQC,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    }),
  ],
  getCQCSignificantEvent
);

router.put(
  "/significantevents/:id",
  [
    enforceRbac({
      service: IMS_SERVICES.CQC,
      action: ACTIONS.UPDATE,
      effect: EFFECTS.ALLOW,
    }),
    injectAttachmentModifierMetaData("attachments"),
  ],
  updateCQCSignificantEvent
);

router.delete(
  "/significantevents/:id",
  [
    enforceRbac({
      service: IMS_SERVICES.CQC,
      action: ACTIONS.DELETE,
      effect: EFFECTS.ALLOW,
    }),
  ],
  deleteSignificantEvent
);

router.delete(
  "/significantevents/:id/attachments/:attachment_id",
  [
    enforceRbac({
      service: IMS_SERVICES.CQC,
      action: ACTIONS.DELETE,
      effect: EFFECTS.ALLOW,
    }),
  ],
  deleteSignificantEventAttachment
);

router.post(
  "/significantevents/:id/planeofactions",
  [
    enforceRbac({
      service: IMS_SERVICES.CQC,
      action: ACTIONS.CREATE,
      effect: EFFECTS.ALLOW,
    }),
  ],
  addSignificantEventAction
);

router.put(
  "/significantevents/:id/planeofactions/:action_id",
  [
    enforceRbac({
      service: IMS_SERVICES.CQC,
      action: ACTIONS.UPDATE,
      effect: EFFECTS.ALLOW,
    }),
  ],
  updateSignificantEventAction
);

router.delete(
  "/significantevents/:id/planeofactions/:action_id",
  [
    enforceRbac({
      service: IMS_SERVICES.CQC,
      action: ACTIONS.DELETE,
      effect: EFFECTS.ALLOW,
    }),
  ],
  removeSignificantEventAction
);

router.get(
  "/spreadsheets/compliants",
  [
    enforceRbac({
      service: IMS_SERVICES.CQC,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    }),
  ],
  getCompliantsCSV
);

router.get(
  "/spreadsheets/whistleblows",
  [
    enforceRbac({
      service: IMS_SERVICES.CQC,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    }),
  ],
  getCQCWhistleBlowsCSV
);

router.get(
  "/spreadsheets/significantevents",
  [
    enforceRbac({
      service: IMS_SERVICES.CQC,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    }),
  ],
  getCQCSignificantEventsCSV
);

module.exports = router;
