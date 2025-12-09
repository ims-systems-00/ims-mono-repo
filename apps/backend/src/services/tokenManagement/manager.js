const PublicAccessTokenModel = require("../../models/mongodb/shared/security/publicAccessTokens");
class Manager {
  constructor(connection) {
    this.connection = connection;
    this.PublicAccessToken = PublicAccessTokenModel();
  }
}
exports.Manager = Manager;
