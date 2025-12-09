const { models } = require("../../models");
const { imsPaginationFormated } = require("../utility");

class Manager {
  constructor(connection) {
    this.connection = connection;
    this.CcCalculation = models.cccalculations(connection);
    this.CcLocation = models.cclocations(connection);
    this.CcParameter = models.ccparameters(connection);
    this.CcCustomFactor = models.cccustomfactors(connection);
    this.CcFactor = models.ccfactors(connection);
    this.CcReports = models.ccreports(connection);
    this.CcCarbonReductionInitiative =
      models.cccarbonreductioninitiatives(connection);
    this.User = models.users(connection);
    this.Organisation = models.organizations(connection);
    this.imsPaginationFormated = imsPaginationFormated;
  }
}
module.exports = { Manager };
