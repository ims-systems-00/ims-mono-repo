const { models } = require("../../models");
const FileHandlerService = require("../fileHandler");
const Trigger = require("../triggers");
const { imsPaginationFormated } = require("../utility");

class Manager {
  constructor(connection) {
    this.connection = connection;
    this.trigger = new Trigger(connection);
    this.imsPaginationFormated = imsPaginationFormated;
    this.Cips = models.cips(connection);
    this.fileHandler = new FileHandlerService(connection);
  }
  _isImplemented(cip) {
    return cip.implemented.status === "Implemented"
  }
}
exports.Manager = Manager;
