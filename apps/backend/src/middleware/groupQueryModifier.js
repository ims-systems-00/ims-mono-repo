const mongoose = require("mongoose");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");
const {
  ROLES,
} = require("../models/mongodb/schemaTemplates/references/typesAndEnums");
const { APIError } = require("openai");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");

const getBuProtectedQueryBasedOnRoles = function (role) {
  let query = {};
  if (role === ROLES.SUPER_ADMIN) {
  }
  if (role === ROLES.HEAD_OF_SERVICE) {
  }
  if (role === ROLES.BASIC_USER) {
  }
  if (role === ROLES.INTERNAL_AUDITOR) {
  }
  if (role === ROLES.EXTERNAL_AUDITOR) {
  }
  return query;
};

const groupQueryModifier = async (req, res, next) => {
  try {
    logger.debug("modifiying BU query", {
      query: req.query,
    });
    req.query = {
      ...req.query,
      ...getBuProtectedQueryBasedOnRoles(req.accessControl.user.role),
    };
    return next();
  } catch (err) {
    logger.error(err.message);
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "User unauthorized." });
  }
};

module.exports = { buQueryModifier };
