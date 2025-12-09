const { models } = require("../../models");

class Manager {
  constructor(connection) {
    this.connection = connection;
    this.PartnershipProgram= models.partnershipPrograms(connection);
    this.User = models.users(connection);
    this.Organisation = models.organizations(connection);
  }
}
module.exports = { Manager };
