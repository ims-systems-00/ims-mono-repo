const { Recovery } = require("../../services/adminAuth");
const { StatusCodes } = require("http-status-codes");

exports.startAccountRecovery = async (req, res, next) => {
  try {
    const recoveryService = new Recovery();
    const recovery = await recoveryService.startAccountRecovery(req.body.email);
    res.status(StatusCodes.OK).json({
      message: "Recovery email sent for verification.",
      details: { ...recovery },
    });
  } catch (error) {
    next(error);
  }
};
exports.recoverAccount = async (req, res, next) => {
  try {
    const token = req.header("x-admin-recovery-token");
    const recoveryService = new Recovery();
    const admin = await recoveryService.recoverAccount(token, req.body.password);
    res.status(StatusCodes.OK).json({
      message: "Account recovered.",
      details: { admin },
    });
  } catch (error) {
    next(error);
  }
};
