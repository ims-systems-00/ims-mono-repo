const { models } = require("../../models");

class Manager {
  constructor(connection) {
    this.connection = connection;
    this.Admin= models.admins(connection);
    this.Session = models.sessions(connection);
  }
}
module.exports = { Manager };
