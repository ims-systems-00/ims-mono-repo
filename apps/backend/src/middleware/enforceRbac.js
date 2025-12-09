const { defineAPIAbilitiesFor } = require("../helpers/accessControl");
const { APIError } = require("../helpers/errors/apiError");
const { ReasonPhrases, StatusCodes } = require("http-status-codes");
const enforceRbac = (rules) => async (req, res, next) => {
  try {
    const externalIdentity = req.accessControl.externalID;
    if (externalIdentity.email) {
      if (externalIdentity.email && externalIdentity.organizationId) {
        return next();
      } else
        throw new APIError(
          ReasonPhrases.FORBIDDEN,
          StatusCodes.FORBIDDEN,
          "External identity validation failed in rbac."
        );
    }
    const user = req.accessControl.user; // assuming user information is stored in req.user
    if (!user)
      throw new APIError(
        ReasonPhrases.FORBIDDEN,
        StatusCodes.FORBIDDEN,
        "User needs to be logged in to pass access control checks."
      );
    const ability = defineAPIAbilitiesFor(user);
    const permitted = ability.can(rules.action, rules.service);
    if (!permitted)
      throw new APIError(
        ReasonPhrases.FORBIDDEN,
        StatusCodes.FORBIDDEN,
        "User does not have permission to access this service. Rbac rules validation failed for user."
      );
    return next();
  } catch (err) {
    return next(err);
  }
};
module.exports = { enforceRbac };
