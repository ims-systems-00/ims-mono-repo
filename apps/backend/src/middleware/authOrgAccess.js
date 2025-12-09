const mongoose = require("mongoose");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");
const {
  ROLES,
} = require("../models/mongodb/schemaTemplates/references/typesAndEnums");
const { APIError } = require("openai");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");

const authOrgAccess = async (req, res, next) => {
  try {
    logger.debug("access control information", {
      accessControl: req.accessControl,
    });
    let externalIdentity = req.accessControl.externalID;
    if (externalIdentity.email) {
      if (!mongoose.Types.ObjectId.isValid(externalIdentity.organizationId)) {
        logger.error(
          "inappropriate orgId validation in authOrg for external identity"
        );
        throw new APIError(
          ReasonPhrases.UNAUTHORIZED,
          StatusCodes.UNAUTHORIZED,
          "User can't access the organisaion."
        );
      }
      if (externalIdentity.organizationId && externalIdentity.email) {
        logger.info(
          "granting limited external access: " + externalIdentity.email
        );
        return next();
      }
    }
    /**
     * req.accessControl is a from tokens so securoity handles
     */
    if (
      !mongoose.Types.ObjectId.isValid(req.accessControl.user.organizationId)
    ) {
      logger.error("inappropriate orgId validation in authOrg");
      throw new APIError(
        ReasonPhrases.UNAUTHORIZED,
        StatusCodes.UNAUTHORIZED,
        "User can't access the organisaion."
      );
    }
    if (!Object.values(ROLES).includes(req.accessControl.user.role)) {
      logger.error("inappropriate role validation in authOrg");
      throw new APIError(
        ReasonPhrases.UNAUTHORIZED,
        StatusCodes.UNAUTHORIZED,
        "User can't access the organisaion."
      );
    }
    return next();
  } catch (err) {
    logger.error(err.message);
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "User unauthorized." });
  }
};

module.exports = { authOrgAccess };
