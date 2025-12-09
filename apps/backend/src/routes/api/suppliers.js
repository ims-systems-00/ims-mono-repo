const express = require("express");
const router = express.Router();
const schemas = require("../../validations/index");
const {
  createSupplier,
  getSupplier,
  getSuppliers,
  editSupplier,
  editIncident,
  resolveIncident,
  getIncident,
  removeSupplier,
  removeSupplierIncident,
  addSlas,
  removeSlas,
  removeContract,
  addOnBoardingFile,
  removeOnBoardingFile,
  addContract,
  addKpiObjectives,
  removeKpiObjectives,
  createIncident,
  getIncidents,
} = require("../../controllers/supplier");

// auth middlewares ....
const { enforceRbac } = require("../../middleware/enforceRbac");
const { validate } = require("../../middleware/validator");

const {
  IMS_SERVICES,
  ACTIONS,
  EFFECTS,
} = require("@ims-systems-00/ims-core/lib/constants");
const {
  injectAttachmentModifierMetaData,
} = require("../../middleware/injectAttachmentModifier");
const validateBody = validate("body");

router.post(
  "/",
  [
    validateBody(schemas.supplierValidation.create),
    enforceRbac({
      service: IMS_SERVICES.SUPPLIER_MANAGEMENT,
      action: ACTIONS.CREATE,
      effect: EFFECTS.ALLOW,
    }),
    injectAttachmentModifierMetaData([
      "slaFiles",
      "contractFiles",
      "onBoardingFiles",
    ]),
  ],
  createSupplier
);

router.get(
  "/",
  [
    enforceRbac({
      service: IMS_SERVICES.SUPPLIER_MANAGEMENT,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    }),
  ],
  getSuppliers
);

router.get(
  "/:id",
  [
    enforceRbac({
      service: IMS_SERVICES.SUPPLIER_MANAGEMENT,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    }),
  ],
  getSupplier
);

router.put(
  "/:id",
  [
    validateBody(schemas.supplierValidation.update),
    enforceRbac({
      service: IMS_SERVICES.SUPPLIER_MANAGEMENT,
      action: ACTIONS.CREATE,
      effect: EFFECTS.ALLOW,
    }),
    injectAttachmentModifierMetaData([
      "slaFiles",
      "contractFiles",
      "onBoardingFiles",
    ]),
  ],
  editSupplier
);

router.delete(
  "/:id",
  [
    enforceRbac({
      service: IMS_SERVICES.SUPPLIER_MANAGEMENT,
      action: ACTIONS.DELETE,
      effect: EFFECTS.ALLOW,
    }),
  ],
  removeSupplier
);

router.post(
  "/:id/slas",
  [
    enforceRbac({
      service: IMS_SERVICES.SUPPLIER_MANAGEMENT,
      action: ACTIONS.CREATE,
      effect: EFFECTS.ALLOW,
    }),
  ],
  addSlas
);

router.delete(
  "/:id/slas/:sla_id",
  [
    enforceRbac({
      service: IMS_SERVICES.SUPPLIER_MANAGEMENT,
      action: ACTIONS.DELETE,
      effect: EFFECTS.ALLOW,
    }),
  ],
  removeSlas
);

router.post(
  "/:id/contracts",
  [
    enforceRbac({
      service: IMS_SERVICES.SUPPLIER_MANAGEMENT,
      action: ACTIONS.CREATE,
      effect: EFFECTS.ALLOW,
    }),
  ],
  addContract
);

router.delete(
  "/:id/contracts/:contract_id",
  [
    enforceRbac({
      service: IMS_SERVICES.SUPPLIER_MANAGEMENT,
      action: ACTIONS.DELETE,
      effect: EFFECTS.ALLOW,
    }),
  ],
  removeContract
);

router.post(
  "/:id/onboarding-files",
  [
    enforceRbac({
      service: IMS_SERVICES.SUPPLIER_MANAGEMENT,
      action: ACTIONS.CREATE,
      effect: EFFECTS.ALLOW,
    }),
  ],
  addOnBoardingFile
);

router.delete(
  "/:id/onboarding-files/:onboarding_file_id",
  [
    enforceRbac({
      service: IMS_SERVICES.SUPPLIER_MANAGEMENT,
      action: ACTIONS.DELETE,
      effect: EFFECTS.ALLOW,
    }),
  ],
  removeOnBoardingFile
);

router.post(
  "/:id/kpi-objectives",
  [
    enforceRbac({
      service: IMS_SERVICES.SUPPLIER_MANAGEMENT,
      action: ACTIONS.CREATE,
      effect: EFFECTS.ALLOW,
    }),
  ],
  addKpiObjectives
);

router.delete(
  "/:id/kpi-objectives/:kpi_obective_id",
  [
    enforceRbac({
      service: IMS_SERVICES.SUPPLIER_MANAGEMENT,
      action: ACTIONS.DELETE,
      effect: EFFECTS.ALLOW,
    }),
  ],
  removeKpiObjectives
);

// router.post(
//   "/:id/incidents",
//   [
//     enforceRbac({
//       service: IMS_SERVICES.SUPPLIER_MANAGEMENT,
//       action: ACTIONS.CREATE,
//       effect: EFFECTS.ALLOW,
//     }),
//   ],
//   createIncident
// );

// router.get(
//   "/:id/incidents",
//   [
//     enforceRbac({
//       service: IMS_SERVICES.SUPPLIER_MANAGEMENT,
//       action: ACTIONS.READ,
//       effect: EFFECTS.ALLOW,
//     }),
//   ],
//   getIncidents
// );

// router.get(
//   "/:id/incidents/:incident_id",
//   [
//     enforceRbac({
//       service: IMS_SERVICES.SUPPLIER_MANAGEMENT,
//       action: ACTIONS.READ,
//       effect: EFFECTS.ALLOW,
//     }),
//   ],
//   getIncident
// );

// router.put(
//   "/:id/incidents/:incident_id",
//   [
//     enforceRbac({
//       service: IMS_SERVICES.SUPPLIER_MANAGEMENT,
//       action: ACTIONS.CREATE,
//       effect: EFFECTS.ALLOW,
//     }),
//   ],
//   editIncident
// );

// router.delete(
//   "/:id/incidents/:incident_id",
//   [
//     enforceRbac({
//       service: IMS_SERVICES.SUPPLIER_MANAGEMENT,
//       action: ACTIONS.DELETE,
//       effect: EFFECTS.ALLOW,
//     }),
//   ],
//   removeSupplierIncident
// );

// router.put(
//   "/:id/incidents/:incident_id/resolutions",
//   [
//     enforceRbac({
//       service: IMS_SERVICES.SUPPLIER_MANAGEMENT,
//       action: ACTIONS.CREATE,
//       effect: EFFECTS.ALLOW,
//     }),
//   ],
//   resolveIncident
// );

module.exports = router;
