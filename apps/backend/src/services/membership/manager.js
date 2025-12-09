const { models } = require("../../models");

class Manager {
  constructor(connection) {
    this.connection = connection;
    this.Membership = models.memberships(connection);
    this.User = models.users(connection);
    this.Organisation = models.organizations(connection);
    this.Group = models.iamgroups(connection)
  }
}
module.exports = { Manager };
