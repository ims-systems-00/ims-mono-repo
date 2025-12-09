const IamGroup = require("../models/mongodb/system/ourIms/iamGroup");
const OrganizationModel = require("../models/mongodb/system/organization/organization");
const UserModel = require("../models/mongodb/system/users&auth/user");
const { IamPolicy } = require("./iamPolicy");
const { asyncWrapper } = require("./utility");
const IamPolicyModel = require("../models/mongodb/system/ourIms/iamPolicy");
const IamRoleModel = require("../models/mongodb/system/ourIms/iamRole");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");
const { APIError } = require("../../src/helpers/errors/apiError");
const { ReasonPhrases, StatusCodes } = require("http-status-codes");
const {
  ROLES,
} = require("../models/mongodb/schemaTemplates/references/typesAndEnums");
class LicenseManagementService extends IamPolicy {
  constructor(orgid) {
    super(orgid);
    this.organizationId = orgid;
    this.User = UserModel();
    this.Organization = OrganizationModel();
    this.Group = IamGroup();
  }
  async authorizeBusinessUnitUsagePermissionInOrg() {
    let organization = await this.Organization.findOne({
      _id: this.organizationId,
    });
    return (
      organization.licenses.groups.allocated -
        organization.licenses.groups.used >
      0
    );
  }
  async authorizeUserUsagePermissionInOrg(role = null) {
    /**
     * we are having to specify role because we charge extra for super users in the organisations. that is why
     * super user catagory is required
     */
    if (!role)
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "A role needs to be specified."
      );
    let organization = await this.Organization.findOne({
      _id: this.organizationId,
    });

    if (role === ROLES.SUPER_ADMIN)
      return (
        organization.licenses.superUser.allocated -
          organization.licenses.superUser.used >
        0
      );

    return (
      organization.licenses.users.allocated - organization.licenses.users.used >
      0
    );
  }
  async haveToolKit(tool) {
    const organization = await this.Organization.findOne({
      _id: this.organizationId,
    });
    if (!organization)
      throw APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Orgnization not found."
      );
    const available = organization.licenses.complianceTools.find(
      (currentTool) => currentTool.name === tool
    );
    if (!available)
      throw APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Orgnization not found."
      );
    return true;
  }
  async utilizeBusinessUnitLicenseInOrg(amount = 1) {
    return this.Organization.updateOne(
      { _id: this.organizationId },
      {
        $inc: {
          "licenses.groups.used": amount,
        },
      }
    );
  }
  async utilizeUserLicenseInOrg(role, amount = 1) {
    if (!role)
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "A role needs to be specified."
      );
    if (role === ROLES.SUPER_ADMIN)
      return this.Organization.updateOne(
        { _id: this.organizationId },
        {
          $inc: {
            "licenses.superUser.used": amount,
          },
        }
      );
    return this.Organization.updateOne(
      { _id: this.organizationId },
      {
        $inc: {
          "licenses.users.used": amount,
        },
      }
    );
  }
  async utilizeComplianceToolLicenseInOrg(tool) {
    await this.Organization.updateOne(
      { _id: this.organizationId },
      {
        $inc: {
          "licenses.complianceTools.$[inner].used": 1,
        },
      },
      {
        arrayFilters: [{ "inner.name": tool }],
        new: true,
      }
    );
  }
  async utilizeUserRoleLicenseInGroup(license, groupId, amount = 1) {}
  async authorizeToolKitGrantPermission(tool) {
    let organization = await this.Organization.findOne({
      _id: this.organizationId,
    });
    if (!organization) return false;
    return organization.licenses.complianceTools.includes(tool);
  }
  async allocateLicenseInGroup(license, groupId, sign) {}
  async provideComlianceToolLicenseToOrg(tool) {
    return this.Organization.updateOne(
      { _id: this.organizationId },
      {
        $push: {
          "licenses.complianceTools": tool,
        },
      }
    );
  }
  async allocateComplianceToolLicense(groupId, tool) {
    let organization = await this.Organization.findOne({
      _id: this.organizationId,
      "licenses.complianceTools": tool,
    });
    if (organization) {
      await this.Group.findOneAndUpdateByOrg(
        this.organizationId,
        { _id: groupId, "userLicenses.complianceTools": { $nin: [tool] } },
        {
          $push: { "userLicenses.complianceTools": tool },
        }
      );
    }
  }
  async complianceToolUserslicenseLookUp(groupId) {}
}
module.exports = LicenseManagementService;
