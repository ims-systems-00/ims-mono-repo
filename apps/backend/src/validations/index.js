const schemas = {
  auditValidation: require("./audit"),
  riskValidation: require("./riskManagement"),
  documentValidation: require("./documentManagement"),
  expensesValidation: require("./wallet/expensereports"),
  leaveValidation: require("./wallet/leaves"),
  userValidation: require("./users&auth"),
  worklogValidation: require("./wallet/worklog"),
  cipValidation: require("./cip"),
  imsProjects: require("./imsProjects"),
  imsForms: require("./imsForms"),
  ccValidation: require("./cc"),
  authValidation: require("./auth"),
  supplierValidation: require("./supplier"),
  txnEmailValidation: require("./txnEmail"),
};
module.exports = schemas;
