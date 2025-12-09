const express = require("express");
const router = express.Router();
const {
  getSignaturesByOrg,
  resendExternalSignature,
  resendInternalSignature,
} = require("../../../../controllers/documentManagement");

// auth middlewares ....
const { enforceRbac } = require("../../../../middleware/enforceRbac");
const { validate } = require("../../../../middleware/validator");
const validationSchemas = require("../../../../validations/index");

const validateBody = validate("body");
const {
  IMS_SERVICES,
  ACTIONS,
  EFFECTS,
} = require("@ims-systems-00/ims-core/lib/constants");

router.get(
  "/",
  [
    enforceRbac({
      service: IMS_SERVICES.DOCUMENT_MANAGEMENT,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    }),
  ],
  getSignaturesByOrg
);

router.post(
  "/resend/external",
  [
    enforceRbac({
      service: IMS_SERVICES.DOCUMENT_MANAGEMENT,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    }),
    validateBody(
      validationSchemas.documentValidation.signature.resendSignatures
    ),
  ],
  resendExternalSignature
);
router.post(
  "/resend/internal",
  [
    enforceRbac({
      service: IMS_SERVICES.DOCUMENT_MANAGEMENT,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    }),
    validateBody(
      validationSchemas.documentValidation.signature.resendSignatures
    ),
  ],
  resendInternalSignature
);

module.exports = router;
