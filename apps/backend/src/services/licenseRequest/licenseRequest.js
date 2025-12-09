const { Manager } = require("./manager");
const { APIError } = require("../../helpers/errors/apiError");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const { sendMail } = require("../../email/sendMail");
const { basicRoleScopedFilter } = require("../../queries");
const { ROLES } = require("@ims-systems-00/ims-core/lib/constants");
const { AdminLicenseRequestedService } = require("./adminLicenseRequest");
class LicenseRequestedService extends Manager {
  constructor(connection) {
    super(connection);
  }
  async createRequest(data) {
    let {
      groups,
      users,
      additionalModules,
      superUser,
      complianceTools,
      projectims,
      carbocalc,
      imsforms,
      message,
    } = data;
    let request = new this.LicenseRequest({
      organization: this.connection.user.organizationId,
      groups: groups,
      users: users,
      complianceTools,
      additionalModules,
      superUser,
      projectims,
      carbocalc,
      imsforms,
      message,
      created: {
        by: this.connection.user._id,
        on: Date.now(),
      },
    });
    request = await request.save();
    let organization = await this.Organisation.findOne({
      _id: request.organization,
    });
    request = await this.LicenseRequest.populateLicenseRequest(request);
    const adminlicenseRequest = new AdminLicenseRequestedService(
      this.connection
    );
    await sendMail(
      "new-ims-licence-request",
      [process.env.SUPPORT_MAIL, process.env.ACCOUNTS_MAIL],
      {
        name: "iMS Systems",
        request,
        frontendClient: process.env.CLIENT_URL,
        organisation: {
          name:
            this.connection.user.organizationId +
            " " +
            this.connection.user.organizationName,
          user: this.connection.user,
          licenses: organization.licenses,
        },
      }
    );
    await adminlicenseRequest.approveRequest(request._id.toString());
    let memberships = await this.Membership.find({
      organization: this.connection.user.organizationId,
      role: ROLES.SUPER_ADMIN,
    }).populate([
      {
        path: "invitedUserId",
        select: "name email",
      },
    ]);
    await sendMail(
      "license-request-recieved-confirmation",
      [
        ...memberships.map((m) => {
          return m.invitedUserId.email;
        }),
      ],
      {
        organizationName: this.connection.user.organizationName,
        requestId: request._id,
      }
    );
    return request;
  }
  async listRequestsByOrg(query, options) {
    let pagination = await this.LicenseRequest.paginateByOrg(
      this.connection?.user?.organizationId,
      { ...query, ...basicRoleScopedFilter(this.connection) },
      options
    );
    let requests = pagination.docs;
    requests = pagination.docs;
    requests = await Promise.all(
      requests.map((request) =>
        this.LicenseRequest.populateLicenseRequest(request)
      )
    );
    return { requests, pagination: this.imsPaginationFormated(pagination) };
  }

  async getRequest(query) {
    let request = await this.LicenseRequest.findOne(query);
    if (!request)
      throw new APIError(
        ReasonPhrases.NOT_FOUND,
        StatusCodes.NOT_FOUND,
        "No request was found with the query."
      );
    return this.LicenseRequest.populateLicenseRequest(request);
  }
  async deleteRequest(query) {
    await this.getRequest(query);
    let request = await this.LicenseRequest.findOneAndDelete(query);
    return request;
  }
}
module.exports = { LicenseRequestedService };
