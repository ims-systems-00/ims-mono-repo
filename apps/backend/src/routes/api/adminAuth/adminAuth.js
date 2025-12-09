const router = require("express").Router();
const {
  login,
  startRegistration,
  verifyRegistration,
  resendVerification,
  startAccountRecovery,
  recoverAccount,
  logout,
  adminRefreshToken,
} = require("../../../controllers/adminAuth");

const { validate } = require("../../../middleware/validator");
const validations = require("../../../validations/adminAuth");
const validateBody = validate("body");

router.post("/auth/login", [validateBody(validations.login)], login);
router.get("/auth/refresh-token", adminRefreshToken);
router.post(
  "/registration",
  [validateBody(validations.register)],
  startRegistration
);
router.post("/registration/verification", verifyRegistration);
router.post(
  "/registration/verification/emails",
  [validateBody(validations.resendVerification)],
  resendVerification
);
router.post(
  "/recovery",
  [validateBody(validations.requestRecovery)],
  startAccountRecovery
);
router.post(
  "/recovery/verification",
  [validateBody(validations.verifyRecovery)],
  recoverAccount
);
router.delete("/auth/logout", logout);

module.exports = router;
