module.exports = {
  ...require("./digitalMaturityMatrix"),
  ...require("./riskLast12Months"),
  ...require("./riskByStatus"),
  ...require("./riskByBusinessUnit"),
  ...require('./auditOverview'),
  ...require("./ofiByBusinessUnit"),
  ...require("./assets"),
  ...require("./finance"),
  ...require("./incidentsByStatus"),
  ...require('./supplierOverview'),
  ...require('./crmOverviews')
};
