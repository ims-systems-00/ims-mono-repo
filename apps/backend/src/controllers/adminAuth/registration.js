const {Registration} = require("../../services/adminAuth");
const {StatusCodes} = require("http-status-codes");

exports.startRegistration = async(req,res,next) => {
    try {
        const registrationService = new Registration();
        const registration = await registrationService.startRegistration(req.body);
        return res.status(StatusCodes.OK).json({
            message: "Registration Process Started.",
            details: {...registration},
        })
    } catch (error) {
        next(error)
    }
}


exports.verifyRegistration = async (req, res, next) => {
    try {
      const token = req.header("x-register-token");
      const registraationService = new Registration();
      const admin = await registraationService.verifyRegistration(token);
      res.status(StatusCodes.OK).json({
        message: "Admin account validation complete.",
        details: { admin },
      });
    } catch (error) {
      next(error);
    }
  };
  exports.resendVerification = async (req, res, next) => {
    try {
      const registraationService = new Registration();
      const admin = await registraationService.resendVerification(req.body.adminId);
      res.status(StatusCodes.OK).json({
        message: "Admin account verification email sent.",
        details: { admin },
      });
    } catch (error) {
      next(error);
    }
  };
  