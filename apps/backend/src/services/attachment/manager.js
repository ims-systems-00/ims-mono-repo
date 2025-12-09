const { models } = require("../../models");

class Manager {
  constructor(connection) {
    this.connection = connection;
    this.Attachment = models.attachments(connection);
    this.User = models.users(connection);
    this.Organisation = models.organizations(connection);
  }
}
module.exports = { Manager };
