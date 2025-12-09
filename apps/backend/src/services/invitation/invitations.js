const { Manager } = require("./manager");
const { APIError } = require("../../helpers/errors/apiError");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const { sendMail } = require("../../email/sendMail");
const sgClient = require("@sendgrid/client");
sgClient.setApiKey(process.env.SEND_GRID_API_KEY);
const { Token } = require("../tokenManagement");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");
const {
  ROLES,
} = require("../../models/mongodb/schemaTemplates/references/typesAndEnums");

class Invitation extends Manager {
  constructor(connection) {
    super(connection);
  }
  getListingQuery() {
    let query = { email: this.connection?.user?.email };
    if (this.connection?.user?.organizationId) {
      query = { organization: this.connection?.user?.organizationId };
    }
    return query;
  }
  async listInvitations(query, options) {
    let pagination = await this.Invitations.paginate(
      {
        ...query,
        ...this.getListingQuery(),
      },
      options
    );
    return pagination;
  }
  async createInvitation(data) {
    if (!data)
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Data is required."
      );
    if (
      !this.connection?.user?.organizationId ||
      !Object.values(ROLES).includes(this.connection?.user?.role)
    )
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Users need to be a part of the organization"
      );
    const foundUser = await this.Users.findOne({ email: data.email });
    if (foundUser) {
      const existingMembership = await this.Memberships.findOne({
        invitedUserId: foundUser._id,
        organization: this.connection?.user?.organizationId,
      });
      if (existingMembership)
        throw new APIError(
          ReasonPhrases.BAD_REQUEST,
          StatusCodes.BAD_REQUEST,
          "User already is a member of organisation."
        );
    }
    data.email = data.email?.toLowerCase();
    const existingInvitation = await this.Invitations.findOne({
      email: data.email,
      organization: this.connection?.user?.organizationId,
    });
    if (existingInvitation)
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "User is already invited."
      );
    const permission =
      await this.licenseManager.authorizeUserUsagePermissionInOrg(data.role);
    if (!permission)
      throw new APIError(
        ReasonPhrases.UNAUTHORIZED,
        StatusCodes.UNAUTHORIZED,
        "You don't have enough licenses to invite users, please request for more licenses via license management."
      );
    const invitationToken = await this.prepareInvitationToken({
      email: data.email,
      organization: this.connection?.user?.organizationId,
      senderName: this.connection.user?.name,
      organizationName: this.connection?.user?.organizationName,
      role: data.role,
    });
    let newInvitation = new this.Invitations({
      email: data.email,
      organization: this.connection?.user?.organizationId,
      role: data.role,
      token: invitationToken,
      createdBy: data.createdBy,
    });
    logger.info("connection output", { connection: this.connection });
    newInvitation = await newInvitation.save();
    const invitationLink = `${
      data.clientUrl || process.env.CLIENT_URL
    }/auth/onboard/accept-invitaion/${invitationToken}?hasAccount=${
      foundUser ? true : false
    }`;
    const name = data.email.split("@")[0];
    logger.debug("invitation link: ", { invitationLink });
    await sendMail("account-invitation", data.email, {
      name: name,
      senderName: this.connection.user.name,
      senderOrganizationName: this.connection.user.organizationName,
      invitationLink,
    });
    /** we are using up one license at the time of invitation */
    return newInvitation;
  }
  async getInvitation(query) {
    let exist = await this.Invitations.findOne(query);
    if (!exist)
      throw new APIError(
        ReasonPhrases.NOT_FOUND,
        StatusCodes.NOT_FOUND,
        "Invitation not found with given query."
      );
    return exist;
  }
  async resendInvitation(id, data) {
    let invitation = await this.getInvitation({ _id: id });
    const invitationToken = await this.prepareInvitationToken({
      email: invitation.email,
      organization: invitation.organization,
      role: invitation.role,
      senderName: this.connection.user?.name,
      organizationName: this.connection?.user?.organizationName,
    });
    const foundUser = await this.Users.findOne({ email: invitation.email });
    const invitationLink = `${
      data.clientUrl || process.env.CLIENT_URL
    }/auth/onboard/accept-invitaion/${invitationToken}?hasAccount=${
      foundUser ? true : false
    }`;
    const name = invitation.email.split("@")[0];
    await sendMail("account-invitation", invitation.email, {
      name: name,
      senderName: this.connection.user.name,
      senderOrganizationName: this.connection.user.organizationName,
      invitationLink,
    });
    invitation.token = invitationToken;
    return invitation.save();
  }
  async removeInvitation(id) {
    const invitation = await this.getInvitation({ _id: id });
    if (invitation) {
      await this.Invitations.deleteOne({ _id: id });
      /** we are freeing up one license as it was used when the invitation was created */
    }
    return invitation;
  }
  async acceptInvitation(token) {
    if (!token)
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Token is required"
      );
    const invitation = await this.getInvitation({ token: token });
    if (invitation) {
      let validationResponse = await Token.verify(token, process.env.JWT_KEY);
      if (!validationResponse.valid) {
        if (validationResponse.expired) {
          throw new APIError(
            ReasonPhrases.FORBIDDEN,
            StatusCodes.FORBIDDEN,
            "Token expired."
          );
        }
        throw new APIError(
          ReasonPhrases.FORBIDDEN,
          StatusCodes.FORBIDDEN,
          "Token is invalid."
        );
      }
      let { email, organization, role } = validationResponse.decoded;
      const foundUser = await this.Users.findOne({ email: email });
      logger.debug("invitation token payload", validationResponse);
      await this.membershipSevice.createMembership({
        invitedUserId: foundUser._id,
        organization,
        role,
      });

      await this.Invitations.deleteOne({ _id: invitation._id });
    }
    return invitation;
  }
  async prepareInvitationToken(data) {
    const invitionToken = await Token.signAccessToken(
      {
        email: data.email,
        organization: data.organization,
        senderName: data.senderName,
        organizationName: data.organizationName,
        role: data.role,
      },
      process.env.JWT_KEY,
      { expiresIn: 3600 * 72 }
    );
    if (!invitionToken)
      throw new APIError(
        ReasonPhrases.FORBIDDEN,
        StatusCodes.FORBIDDEN,
        "Invitation token could not be signed."
      );
    return invitionToken;
  }
}

module.exports = { Invitation };
