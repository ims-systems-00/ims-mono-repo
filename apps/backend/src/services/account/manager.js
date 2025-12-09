const { model } = require("mongoose");
const { models } = require("../../models");

class Manager {
  constructor(connection) {
    this.connection = connection;
    this.Sessions = models.sessions(connection);
    this.Users = models.users(connection);
    this.Organisations = models.organizations(connection);
    this.IamPolicies = models.iampolicies(connection);
    this.Membership = models.memberships(connection);
    this.PartnershipPrograms = models.partnershipPrograms(connection);
    this.TxnEmails = models.txnEmails(connection);
  }
}
module.exports = { Manager };
