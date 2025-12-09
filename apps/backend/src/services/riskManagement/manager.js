const { models } = require("../../models");
const FileHandlerService = require("../fileHandler");
const Trigger = require("../../services/triggers");
const { imsPaginationFormated } = require("../utility");
const CacheControl = require("../../cache/cacheControll");

class Manager {
  constructor(connection) {
    this.connection = connection;
    this.riskCache = new CacheControl({
      cacheClient: "redis",
      prefix: "risk",
      expireInSeconds: 600,
    });
    this.trigger = new Trigger(connection);
    this.imsPaginationFormated = imsPaginationFormated;
    this.Risks = models.risks(connection);
    this.fileHandler = new FileHandlerService(connection);
    this.Membership = models.memberships(connection);
  }
}
exports.Manager = Manager;
