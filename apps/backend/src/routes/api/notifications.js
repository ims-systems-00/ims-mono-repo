const express = require("express");
const router = express.Router();

const {
  getNotifications,
  updateNotificationsSentStatus,
  updateNotificationReadStatus,
  updateNotificationPopUpStatus,
  updateBulkNotificationPopUpStatus,
  createNotifications,
  nudgePeople,
  getNotification,
} = require("../../controllers/notifications");

// auth middlewares ....
const { enforceRbac } = require("../../middleware/enforceRbac");
const {
  IMS_SERVICES,
  ACTIONS,
  EFFECTS,
} = require("@ims-systems-00/ims-core/lib/constants");

router.post(
  "/",
  [
    enforceRbac({
      service: IMS_SERVICES.OUR_IMS,
      action: ACTIONS.CREATE,
      effect: EFFECTS.ALLOW,
    }),
  ],
  createNotifications
);

router.post("/nudge-people", [], nudgePeople);

router.get(
  "/",
  [
    // enforceRbac({
    //     service: IMS_SERVICES.RISK_MANAGEMENT,
    //     action: ACTIONS.READ,
    //     effect: EFFECTS.ALLOW
    // })
  ],
  getNotifications
);

router.get(
  "/:id",
  [
    // enforceRbac({
    //     service: IMS_SERVICES.RISK_MANAGEMENT,
    //     action: ACTIONS.READ,
    //     effect: EFFECTS.ALLOW
    // })
  ],
  getNotification
);

router.put(
  "/sent-status/:userId",
  [
    // enforceRbac({
    //     service: IMS_SERVICES.RISK_MANAGEMENT,
    //     action: ACTIONS.READ,
    //     effect: EFFECTS.ALLOW
    // })
  ],
  updateNotificationsSentStatus
);

router.put(
  "/read-status/:notificationId",
  [
    // enforceRbac({
    //     service: IMS_SERVICES.RISK_MANAGEMENT,
    //     action: ACTIONS.READ,
    //     effect: EFFECTS.ALLOW
    // })
  ],
  updateNotificationReadStatus
);

router.put(
  "/popup-status/:notificationId",
  [
    // enforceRbac({
    //     service: IMS_SERVICES.RISK_MANAGEMENT,
    //     action: ACTIONS.READ,
    //     effect: EFFECTS.ALLOW
    // })
  ],
  updateNotificationPopUpStatus
);

router.put(
  "/popup-status/bulk/:userId/",
  [
    // enforceRbac({
    //     service: IMS_SERVICES.RISK_MANAGEMENT,
    //     action: ACTIONS.READ,
    //     effect: EFFECTS.ALLOW
    // })
  ],
  updateBulkNotificationPopUpStatus
);

module.exports = router;
