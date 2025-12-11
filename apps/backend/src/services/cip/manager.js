const CacheControl = require("../../cache/cacheControll");
const { models } = require("../../models");
const FileHandlerService = require("../fileHandler");
const Trigger = require("../triggers");
const { imsPaginationFormated } = require("../utility");

class Manager {
  constructor(connection) {
    this.connection = connection;
    this.cipCache = new CacheControl({
      cacheClient: "redis",
      prefix: "cip",
      expireInSeconds: 600,
    });
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
