const { models } = require("../../models");
const FileHandlerService = require("../fileHandler");
const Trigger = require("../triggers");
const { imsPaginationFormated } = require("../utility");

class Manager {
  constructor(connection) {
    this.connection = connection;
    this.trigger = new Trigger(connection);
    this.imsPaginationFormated = imsPaginationFormated;
    this.ManagementReviews = models.managementreviews(connection);
    this.KpiObjectives = models.kpiobjectives(connection);
    this.fileHandler = new FileHandlerService(connection);
    this.Membership = models.memberships(connection)
  }
  _isComplete(review) {
    return review?.completed?.status;
  }
}
exports.Manager = Manager;
