const { models } = require("../../models");

class Manager {
  constructor(connection) {
    this.connection = connection;
    this.ImsForm = models.imsForms(connection);
    this.ImsFormElement = models.imsFormElements(connection);
    this.ImsFormResponse = models.imsFormResponses(connection);
    this.ImsFormSubmission = models.imsFormSubmissions(connection);
    this.User = models.users(connection);
    this.Organisation = models.organizations(connection);
  }
}
module.exports = { Manager };
