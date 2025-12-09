const { models } = require("../../models");
const FileHandlerService = require("../fileHandler");
const Trigger = require("../../services/triggers");
const { imsPaginationFormated } = require("../utility");
class Manager {
  constructor(connection) {
    this.connection = connection;
    this.trigger = new Trigger(connection);
    this.imsPaginationFormated = imsPaginationFormated;
    this.LicenseRequest = models.licenserequests(connection);
    this.Membership = models.memberships(connection);
    this.Organisation = models.organizations(connection);
    this.IamGroup = models.iamgroups(connection);
    this.Users = models.users(connection);
    this.Supplier = models.suppliers(connection);
    this.fileHandler = new FileHandlerService(connection);
  }
}
exports.Manager = Manager;
