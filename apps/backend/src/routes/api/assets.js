const express = require("express");
const {
  createHardwareAsset,
  createSoftwareAsset,
  createPeopleAsset,
  createPremiseAsset,
  getHardwareAssets,
  getSoftwareAssets,
  getPeopleAssets,
  getPremiseAssets,
  getHardwareAsset,
  getSoftwareAsset,
  getPeopleAsset,
  getPremiseAsset,
  editHardwareAsset,
  editPeopleAsset,
  editSoftwareAsset,
  editPremiseAsset,
  removeHardwareAsset,
  removeSoftwareAsset,
  removePeopleAsset,
  removePremiseAsset,
  addSoftwareKey,
  addSoftwareDocument,
  createInformationAsset,
  getInformationAssets,
  getInformationAsset,
  editInformationAsset,
  removeInformationAsset,
  removeSoftwareDocument,
  removeSoftwareKey,
} = require("../../controllers/assets");
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
const validations = require("../../validations/inventory");
const validateBody = validate("body");

// auth middlewares ....

const router = express.Router();

router.post(
  "/hardwares",
  [
    enforceRbac({
      service: IMS_SERVICES.INVENTORY,
      action: ACTIONS.CREATE,
      effect: EFFECTS.ALLOW,
    }),
    validateBody(validations.createHardwareValidation),
  ],
  createHardwareAsset
);

router.get(
  "/hardwares",
  [
    enforceRbac({
      service: IMS_SERVICES.INVENTORY,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    }),
  ],
  getHardwareAssets
);

router.get(
  "/hardwares/:id",
  [
    enforceRbac({
      service: IMS_SERVICES.INVENTORY,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    }),
  ],
  getHardwareAsset
);
router.put(
  "/hardwares/:id",
  [
    enforceRbac({
      service: IMS_SERVICES.INVENTORY,
      action: ACTIONS.CREATE,
      effect: EFFECTS.ALLOW,
    }),
    validateBody(validations.updateHardwareValidation),
  ],
  editHardwareAsset
);

router.delete(
  "/hardwares/:id",
  [
    enforceRbac({
      service: IMS_SERVICES.INVENTORY,
      action: ACTIONS.DELETE,
      effect: EFFECTS.ALLOW,
    }),
  ],
  removeHardwareAsset
);

router.post(
  "/softwares",
  [
    enforceRbac({
      service: IMS_SERVICES.INVENTORY,
      action: ACTIONS.CREATE,
      effect: EFFECTS.ALLOW,
    }),
    injectAttachmentModifierMetaData("docs"),
    validateBody(validations.createSoftwareValidation),
  ],
  createSoftwareAsset
);

router.get(
  "/softwares",
  [
    enforceRbac({
      service: IMS_SERVICES.INVENTORY,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    }),
  ],
  getSoftwareAssets
);
router.put(
  "/softwares/:id",
  [
    enforceRbac({
      service: IMS_SERVICES.INVENTORY,
      action: ACTIONS.CREATE,
      effect: EFFECTS.ALLOW,
    }),
    injectAttachmentModifierMetaData("docs"),
    validateBody(validations.updateSoftwareValidation),
  ],
  editSoftwareAsset
);
router.get(
  "/softwares/:id",
  [
    enforceRbac({
      service: IMS_SERVICES.INVENTORY,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    }),
  ],
  getSoftwareAsset
);

router.delete(
  "/softwares/:id",
  [
    enforceRbac({
      service: IMS_SERVICES.INVENTORY,
      action: ACTIONS.DELETE,
      effect: EFFECTS.ALLOW,
    }),
  ],
  removeSoftwareAsset
);

router.post(
  "/softwares/:id/keys",
  [
    enforceRbac({
      service: IMS_SERVICES.INVENTORY,
      action: ACTIONS.CREATE,
      effect: EFFECTS.ALLOW,
    }),
  ],
  addSoftwareKey
);

router.delete(
  "/softwares/:id/keys/:key_id",
  [
    enforceRbac({
      service: IMS_SERVICES.INVENTORY,
      action: ACTIONS.DELETE,
      effect: EFFECTS.ALLOW,
    }),
  ],
  removeSoftwareKey
);

router.post(
  "/softwares/:id/documents",
  [
    enforceRbac({
      service: IMS_SERVICES.INVENTORY,
      action: ACTIONS.CREATE,
      effect: EFFECTS.ALLOW,
    }),
  ],
  addSoftwareDocument
);

router.delete(
  "/softwares/:id/documents/:doc_id",
  [
    enforceRbac({
      service: IMS_SERVICES.INVENTORY,
      action: ACTIONS.DELETE,
      effect: EFFECTS.ALLOW,
    }),
  ],
  removeSoftwareDocument
);

router.post(
  "/informations",
  [
    enforceRbac({
      service: IMS_SERVICES.INVENTORY,
      action: ACTIONS.CREATE,
      effect: EFFECTS.ALLOW,
    }),
    validateBody(validations.createInformationValidation),
  ],
  createInformationAsset
);

router.put(
  "/informations/:id",
  [
    enforceRbac({
      service: IMS_SERVICES.INVENTORY,
      action: ACTIONS.CREATE,
      effect: EFFECTS.ALLOW,
    }),
    validateBody(validations.updateInformationValidation),
  ],
  editInformationAsset
);

router.get(
  "/informations",
  [
    enforceRbac({
      service: IMS_SERVICES.INVENTORY,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    }),
  ],
  getInformationAssets
);

router.get(
  "/informations/:id",
  [
    enforceRbac({
      service: IMS_SERVICES.INVENTORY,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    }),
  ],
  getInformationAsset
);

router.delete(
  "/informations/:id",
  [
    enforceRbac({
      service: IMS_SERVICES.INVENTORY,
      action: ACTIONS.DELETE,
      effect: EFFECTS.ALLOW,
    }),
  ],
  removeInformationAsset
);

router.post(
  "/premises",
  [
    enforceRbac({
      service: IMS_SERVICES.INVENTORY,
      action: ACTIONS.CREATE,
      effect: EFFECTS.ALLOW,
    }),
    validateBody(validations.createPremiseValidation),
  ],
  createPremiseAsset
);

router.get(
  "/premises",
  [
    enforceRbac({
      service: IMS_SERVICES.INVENTORY,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    }),
  ],
  getPremiseAssets
);

router.get(
  "/premises/:id",
  [
    enforceRbac({
      service: IMS_SERVICES.INVENTORY,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    }),
  ],
  getPremiseAsset
);

router.put(
  "/premises/:id",
  [
    enforceRbac({
      service: IMS_SERVICES.INVENTORY,
      action: ACTIONS.CREATE,
      effect: EFFECTS.ALLOW,
    }),
    validateBody(validations.updatePremiseValidation),
  ],
  editPremiseAsset
);
router.delete(
  "/premises/:id",
  [
    enforceRbac({
      service: IMS_SERVICES.INVENTORY,
      action: ACTIONS.DELETE,
      effect: EFFECTS.ALLOW,
    }),
  ],
  removePremiseAsset
);

router.post(
  "/peoples",
  [
    enforceRbac({
      service: IMS_SERVICES.INVENTORY,
      action: ACTIONS.CREATE,
      effect: EFFECTS.ALLOW,
    }),
    validateBody(validations.createPeopleValidation),
  ],
  createPeopleAsset
);
router.get(
  "/peoples",
  [
    enforceRbac({
      service: IMS_SERVICES.INVENTORY,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    }),
  ],
  getPeopleAssets
);
router.get(
  "/peoples/:id",
  [
    enforceRbac({
      service: IMS_SERVICES.INVENTORY,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    }),
  ],
  getPeopleAsset
);
router.put(
  "/peoples/:id",
  [
    enforceRbac({
      service: IMS_SERVICES.INVENTORY,
      action: ACTIONS.CREATE,
      effect: EFFECTS.ALLOW,
    }),
    validateBody(validations.updatePeopleValidation),
  ],
  editPeopleAsset
);
router.delete(
  "/peoples/:id",
  [
    enforceRbac({
      service: IMS_SERVICES.INVENTORY,
      action: ACTIONS.DELETE,
      effect: EFFECTS.ALLOW,
    }),
  ],
  removePeopleAsset
);

module.exports = router;
