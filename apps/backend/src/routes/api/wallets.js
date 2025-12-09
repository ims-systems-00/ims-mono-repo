const express = require("express");
const router = express.Router();

// auth middlewares ....
const { enforceRbac } = require("../../middleware/enforceRbac");
const {
  IMS_SERVICES,
  ACTIONS,
  EFFECTS,
} = require("@ims-systems-00/ims-core/lib/constants");

const expenseReportRoutes = require("./expensereports");
const leaveRoutes = require("./leaves");
const worklogRoutes = require("./worklog");

const {
  createAlert,
  getAlerts,
  getAlert,
  deleteAlert,
  updateAlert,
} = require("../../controllers/staffAlerts");

router.use("/expensereports", expenseReportRoutes);

router.post("/units", [], () => {});

router.use("/leaves", leaveRoutes);

router.use("/worklog", worklogRoutes);

router.post(
  "/pdpandforms",
  [
    enforceRbac({
      service: IMS_SERVICES.CQC,
      action: ACTIONS.CREATE,
      effect: EFFECTS.ALLOW,
    }),
  ],
  () => {}
);

router.get(
  "/pdpandforms",
  [
    enforceRbac({
      service: IMS_SERVICES.CQC,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    }),
  ],
  () => {}
);

router.get(
  "/pdpandforms/:id",
  [
    enforceRbac({
      service: IMS_SERVICES.CQC,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    }),
  ],
  () => {}
);

router.put(
  "/pdpandforms/:id",
  [
    enforceRbac({
      service: IMS_SERVICES.CQC,
      action: ACTIONS.UPDATE,
      effect: EFFECTS.ALLOW,
    }),
  ],
  () => {}
);

router.delete("/pdpandforms/:id", [], () => {});

router.post("/alerts", [], createAlert);

router.get("/alerts", [], getAlerts);

router.get("/alerts/:id", [], getAlert);

router.put("/alerts/:id", [], updateAlert);

router.delete("/alerts/:id", [], deleteAlert);

module.exports = router;
