const express = require("express");
const router = express.Router();
const {
  getAdminDashBoard,
  getBusinessFunctionDashBoard,
  getBusinessFunctionDashBoards,
  extractBusinessFunctionDashboardReport,
  extractAdminReport,
} = require("../../controllers/dashboard");

const { enforceRbac } = require("../../middleware/enforceRbac");
const {
  IMS_SERVICES,
  ACTIONS,
  EFFECTS,
} = require("@ims-systems-00/ims-core/lib/constants");

router.get(
  "/organisation",
  [
    enforceRbac({
      service: IMS_SERVICES.DASHBOARD,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    }),
  ],
  getAdminDashBoard
);

router.get('/groups/:id', [
    enforceRbac({
      service: IMS_SERVICES.DASHBOARD,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    }),
  ],
  getBusinessFunctionDashBoard
);

router.get('/groups/', [
    enforceRbac({
      service: IMS_SERVICES.DASHBOARD,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    }),
  ],
  getBusinessFunctionDashBoards
);

router.post(
  "/organisation",
  [
    enforceRbac({
      service: IMS_SERVICES.DASHBOARD,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    }),
  ],
  extractAdminReport
);

router.post(
  "/groups/:group_id",
  [
    enforceRbac({
      service: IMS_SERVICES.DASHBOARD,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    }),
  ],
  extractBusinessFunctionDashboardReport
);

module.exports = router;
