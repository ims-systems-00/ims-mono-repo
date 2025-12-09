const { APIError } = require("../helpers/errors/apiError");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const AdminsModel = require("../models/mongodb/system/adminAuth/imsAdmin");

const checkImsAdmin = async (req, res, next) => {
  let Admin = AdminsModel(req.adminControl)
  try {
    if(!req.adminControl?.admin)
      //throw error
      throw new APIError(
        ReasonPhrases.UNAUTHORIZED,
        StatusCodes.UNAUTHORIZED,
        "This user is not allowed to access this routes."
      );
    //req.accessControl.user ache ? jodi thake taile dev team er kache mail

    const adminId = req.adminControl.admin._id
    const admin = await Admin.findOne({ _id: adminId });
    if (!admin) {
      throw new APIError(
        ReasonPhrases.UNAUTHORIZED,
        StatusCodes.UNAUTHORIZED,
        "This user is not allowed to access this routes."
      );
    }
    return next();
  } catch (error) {
    next(error);
  }
};

module.exports = checkImsAdmin;
