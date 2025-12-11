const CacheControl = require("../../cache/cacheControll");
const { models } = require("../../models");
const FileHandlerService = require("../fileHandler");
const Trigger = require("../triggers");
const { imsPaginationFormated } = require("../utility");

class Manager {
  constructor(connection) {
    this.connection = connection;
    this.trigger = new Trigger(connection);
    this.incidentCache = new CacheControl({
      cacheClient: "redis",
      prefix: "incident",
      expireInSeconds: 600,
    });
    this.imsPaginationFormated = imsPaginationFormated;
    this.Incidents = models.incidents(connection);
    this.fileHandler = new FileHandlerService(connection);
    this.Membership = models.memberships(connection);
  }
  _isResolved(incident) {
    return incident?.resolved?.status;
  }
  _isEscalated(incident) {
    return incident?.escalated?.status;
  }
}
exports.Manager = Manager;
