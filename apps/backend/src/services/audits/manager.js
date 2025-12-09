const { models } = require("../../models");
const { FileManager } = require("../../helpers/fileManager");
const Trigger = require("../triggers");
const { imsPaginationFormated } = require("../utility");

class Manager {
  constructor(connection) {
    this.connection = connection;
    this.trigger = new Trigger(connection);
    this.imsPaginationFormated = imsPaginationFormated;
    this.Audits = models.audits(connection);
    this.Membership = models.memberships(connection);
    this.Risks = models.risks(connection);
    this.Cips = models.cips(connection);
    this.Incidents = models.incidents(connection);
    this.fileHandler = new FileManager(connection);
  }
  /**
   * utility functions checks various validation and business logics
   * for performing action on data.
   */
  _isComplete(audit) {
    return audit?.completed?.status;
  }
}
exports.Manager = Manager;
