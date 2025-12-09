const { Manager } = require("./manager");
const { APIError } = require("../../helpers/errors/apiError");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const { sendMail } = require("../../email/sendMail");
const { ROLES } = require("@ims-systems-00/ims-core/lib/constants");
const { ComplianceToolCRUDOps } = require("../complianceManager");
const PaymentService = require("../payments");

class AdminLicenseRequestedService extends Manager {
  constructor(connection) {
    super(connection);
  }
  async cancelRequest(id) {
    let request = await this.LicenseRequest.findOne({ _id: id });
    if (!request) {
      throw new APIError(
        ReasonPhrases.NOT_FOUND,
        StatusCodes.NOT_FOUND,
        "Request not found with the given ID."
      );
    }
    if (request.granted.status === "Pending") {
      request = await this.LicenseRequest.findOneAndUpdate(
        { _id: id },
        {
          $set: {
            granted: {
              by: this.connection.admin?._id || null,
              on: Date.now(),
              status: "Cancled",
            },
          },
        },
        { new: true }
      );
      request = await this.LicenseRequest.populateLicenseRequest(request);
      let memberships = await this.Membership.find({
        organization: request.organization?._id,
        role: ROLES.SUPER_ADMIN,
      }).populate([
        {
          path: "invitedUserId",
          select: "name email",
        },
      ]);
      await sendMail(
        "licence-request-cancelled",
        [
          ...memberships.map((m) => {
            return m.invitedUserId.email;
          }),
        ],
        {
          name: request.organization.name,
        }
      );
      return request;
    } else {
      throw new APIError(
        ReasonPhrases.INTERNAL_SERVER_ERROR,
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Only pending status can be canceled."
      );
    }
  }
  async approveRequest(id) {
    let payment = new PaymentService(this.connection);
    let request = await this.LicenseRequest.findOne({ _id: id });
    if (!request) {
      throw new APIError(
        ReasonPhrases.NOT_FOUND,
        StatusCodes.NOT_FOUND,
        "Request not found with the given ID."
      );
    }
    if (request.granted.status === "Pending") {
      let organization = await this.Organisation.findOne({
        _id: request.organization,
      });
      if (!organization)
        throw new APIError(
          ReasonPhrases.BAD_REQUEST,
          StatusCodes.BAD_REQUEST,
          "Orgnization not found."
        );
      organization.licenses.groups.allocated += request.groups;
      organization.licenses.users.allocated += request.users;
      organization.licenses.superUser.allocated += request.superUser;
      if (request.projectims)
        organization.licenses.projectims = request.projectims;
      if (request.carbocalc)
        organization.licenses.carbocalc = request.carbocalc;
      if (request.imsforms) organization.licenses.imsforms = request.imsforms;
      request.complianceTools.forEach((tool) => {
        if (!organization.licenses.complianceTools.includes(tool))
          organization.licenses.complianceTools.push(tool);
      });
      request.additionalModules.forEach((tool) => {
        if (!organization.licenses.additionalModules.includes(tool))
          organization.licenses.additionalModules.push(tool);
      });
      await organization.save();
      const complaince = new ComplianceToolCRUDOps(this.connection);
      for (let toolName of request.complianceTools) {
        await complaince.createComplianceTool({ name: toolName });
      }
      /** update stripe subscription optionally */
      if (organization.paymentSystem.information.stripeSubscriptionId) {
        await payment.upgradeSubscriptionWithStripe(
          organization.paymentSystem.information.stripeSubscriptionId,
          request
        );
      }
      request.granted.by = this.connection.admin?._id || null;
      request.granted.on = Date.now();
      request.granted.status = "Granted";
      request = await request.save();
      request = await this.LicenseRequest.populateLicenseRequest(request);
      let memberships = await this.Membership.find({
        organization: organization?._id,
        role: ROLES.SUPER_ADMIN,
      }).populate([
        {
          path: "invitedUserId",
          select: "name email",
        },
      ]);
      await sendMail(
        "licence-request-processed",
        [
          ...memberships.map((m) => {
            return m.invitedUserId.email;
          }),
        ],
        {
          name: organization.name,
        }
      );
      return request;
    } else {
      throw new APIError(
        ReasonPhrases.INTERNAL_SERVER_ERROR,
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Only pending status can be Approved."
      );
    }
  }
}
module.exports = { AdminLicenseRequestedService };
