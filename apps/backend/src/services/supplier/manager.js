const { models } = require("../../models");
const FileHandlerService = require("../fileHandler");
const Trigger = require("../../services/triggers");
const { imsPaginationFormated } = require("../utility");

class Manager {
  constructor(connection) {
    this.connection = connection;
    this.trigger = new Trigger(connection);
    this.imsPaginationFormated = imsPaginationFormated;
    this.Supplier = models.suppliers(connection);
    this.fileHandler = new FileHandlerService(connection);
  }
}
exports.Manager = Manager;
