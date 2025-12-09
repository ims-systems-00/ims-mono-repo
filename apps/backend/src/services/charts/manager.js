const { models } = require("../../models");

class Manager {
  constructor(connection) {
    this.connection = connection;
    this.Charts = models.charts(connection);
  }
}
module.exports = { Manager };
