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
} = require("../../controllers/auth");
const {
  authEmailBeforeRegistration,
} = require("../../middleware/authEmailBeforeRegistration");
router.post("/registration", [authEmailBeforeRegistration], startRegistration);

router.post("/", [], signIn);

router.post("/refresh-token", [], refreshToken);

router.delete("/", [], signOut);

router.post("/verification", [], verifyAccount);

router.post("/verification/:id/", [], resendEmailVarification);

router.post("/forgotpassword", [], forgotPassword);

router.post("/resetpassword", [], resetPassword);

module.exports = router;
