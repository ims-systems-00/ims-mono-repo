module.exports = {
  ...require("./digitalMaturityMatrix"),
  ...require("./riskLast12Months"),
  ...require("./riskByStatus"),
  ...require("./riskByBusinessUnit"),
  ...require('./nonConmitiesByBusinessUnit'),
  ...require("./ofiByBusinessUnit"),
  ...require("./assets"),
  ...require("./finance"),
  ...require("./incidentsByBusinessUnit"),
  ...require('./supplierOverview'),
  ...require('./crmOverviews')
};
