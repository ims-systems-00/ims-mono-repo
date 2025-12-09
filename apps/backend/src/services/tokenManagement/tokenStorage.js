const { Manager } = require("./manager");
const { Token } = require("./token");
class TokenStorageService extends Manager {
  constructor(connection) {
    super(connection);
  }
  async createSecurityAccessToken(data) {
    let token = await Token.signToken(
      data.token?.payload,
      process.env.JWT_KEY,
      {
        expiresIn: data.token?.expiresIn || 3600,
      }
    );
    let tokenInformation = new this.PublicAccessToken({
      organization: this.connection?.user?.organizationId,
      description: data.description,
      value: token,
    });
    return tokenInformation.save();
  }
  async getToken(query) {
    let token = await this.PublicAccessToken.findOne(query);
    if (!token) throw new Error("No token was found : ");
    return token;
  }
  async deleteToken(id) {
    return this.PublicAccessToken.deleteOne({ _id: id });
  }
}
exports.TokenStorageService = TokenStorageService;
