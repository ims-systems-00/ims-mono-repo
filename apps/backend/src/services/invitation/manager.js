const { models } = require("../../models");
const { Membership } = require("../../services/membership");
const LicenseManagementService = require("../licenseManager");
class Manager {
  constructor(connection) {
    this.connection = connection;
    this.Invitations = models.invitations(connection);
    this.Users = models.users(connection);
    this.Memberships = models.memberships(connection);
    this.membershipSevice = new Membership(connection);
    this.licenseManager = new LicenseManagementService(
      connection?.user?.organizationId
    );
  }
}
module.exports = { Manager };
