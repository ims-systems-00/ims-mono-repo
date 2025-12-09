const { logger } = require("@ims-systems-00/ims-core/lib/logger");
const {
  ROLES,
} = require("../models/mongodb/schemaTemplates/references/typesAndEnums");

exports.basicRoleScopedFilter = function (accessControl) {
  const orgnizationAndGroupMatch = {
    group: { $in: [accessControl.user.groupId, null] },
  };
  const onlyGroupMatch = {
    group: accessControl.user.groupId,
  };
  let finalFilter = {};
  if (
    accessControl.user.role === ROLES.SUPER_ADMIN ||
    accessControl.user.role === ROLES.EXTERNAL_AUDITOR ||
    accessControl.user.role === ROLES.INTERNAL_AUDITOR
  ) {
    /** no filer logic rquired, fetch everything by default */
  }
  if (
    accessControl.user.role === ROLES.HEAD_OF_SERVICE ||
    accessControl.user.role === ROLES.BASIC_USER
  ) {
    finalFilter = { ...orgnizationAndGroupMatch };
  }
  if (accessControl.user.role === ROLES.EXTERNAL_USER) {
    finalFilter = { ...onlyGroupMatch };
  }
  logger.debug("basic role scoped filter: ", finalFilter);
  return finalFilter;
};
