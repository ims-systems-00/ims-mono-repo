const express = require("express");
const router = express.Router();
const validationSchemas = require("../../../../validations/index");

const {
  createDocumentRepository,
  respositoryQueryConstructor,
  getDocumentRepository,
  getDocumentRepositoris,
  updateDocumentRepository,
  softDeleteDocumentRepository,
  restoreDocumentRepository,
  hardDeleteDocumentRepository,
} = require("../../../../controllers/documentManagement");

// auth middlewares ....
const { enforceRbac } = require("../../../../middleware/enforceRbac");
const { validate } = require("../../../../middleware/validator");
const validateBody = validate("body");
const {
  IMS_SERVICES,
  ACTIONS,
  EFFECTS,
} = require("@ims-systems-00/ims-core/lib/constants");

router.post(
  "/",
  [
    validateBody(validationSchemas.documentValidation.repository.create),
    enforceRbac({
      service: IMS_SERVICES.DOCUMENT_MANAGEMENT,
      action: ACTIONS.CREATE,
      effect: EFFECTS.ALLOW,
    }),
  ],
  createDocumentRepository
);

router.get(
  "/",
  [
    enforceRbac({
      service: IMS_SERVICES.DOCUMENT_MANAGEMENT,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    }),
  ],
  respositoryQueryConstructor,
  getDocumentRepositoris
);

router.put(
  "/:id",
  [
    validateBody(validationSchemas.documentValidation.repository.update),
    enforceRbac({
      service: IMS_SERVICES.DOCUMENT_MANAGEMENT,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    }),
  ],
  updateDocumentRepository
);

router.get(
  "/:id",
  [
    enforceRbac({
      service: IMS_SERVICES.DOCUMENT_MANAGEMENT,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    }),
  ],
  getDocumentRepository
);

router.delete(
  "/:id/soft",
  [
    enforceRbac({
      service: IMS_SERVICES.DOCUMENT_MANAGEMENT,
      action: ACTIONS.DELETE,
      effect: EFFECTS.ALLOW,
    }),
  ],
  softDeleteDocumentRepository
);
router.delete(
  "/:id/hard",
  [
    enforceRbac({
      service: IMS_SERVICES.DOCUMENT_MANAGEMENT,
      action: ACTIONS.DELETE,
      effect: EFFECTS.ALLOW,
    }),
  ],
  hardDeleteDocumentRepository
);
router.put(
  "/:id/restore",
  [
    enforceRbac({
      service: IMS_SERVICES.DOCUMENT_MANAGEMENT,
      action: ACTIONS.DELETE,
      effect: EFFECTS.ALLOW,
    }),
  ],
  restoreDocumentRepository
);
module.exports = router;
