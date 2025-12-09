const express = require("express");
const router = express.Router();
const {
  startRegistration,
  signIn,
  forgotPassword,
  signOut,
  resendEmailVarification,
  verifyAccount,
  resetPassword,
  refreshToken,
  authorize,
  token,
  authCode,
  txnEmailInvitation,
} = require("../../controllers/v3auth");
const {
  authEmailBeforeRegistration,
} = require("../../middleware/authEmailBeforeRegistration");
const { validate } = require("../../middleware/validator");
const { authValidation } = require("../../validations");
const { deserializeUser } = require("../../middleware/deserializeUser");
const validateQuery = validate("query");
const validateBody = validate("body");
router.post("/registration", [authEmailBeforeRegistration], startRegistration);

router.post("/", [validateBody(authValidation.signInBody)], signIn);

router.post("/refresh-token", [], refreshToken);

router.delete("/", [], signOut);

router.post("/verification", [], verifyAccount);

router.post("/verification/:id/", [], resendEmailVarification);

router.post("/forgotpassword", [], forgotPassword);

router.post("/resetpassword", [], resetPassword);

router.get(
  "/authorize",
  [validateQuery(authValidation.authoriseQuery)],
  authorize
);

// user must be logged in already to generate a auth code
router.get(
  "/code",
  [deserializeUser, validateQuery(authValidation.authCodeQuery)],
  authCode
);

router.post("/token", token);

router.post("/txn-email-verification", [], txnEmailInvitation);

module.exports = router;
