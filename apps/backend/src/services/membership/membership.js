const { Manager } = require("./manager");
const { APIError } = require("../../helpers/errors/apiError");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const LicenseManagementService = require("../licenseManager");

const population = [
  {
    path: "organization",
    select: "name logo isCustomer isPartner licenses",
  },
  {
    path: "invitedUserId",
    select: "name email profileImageSrc accessPolicies jobTitle",
  },
  {
    path: "groups",
    select: "name type",
  },
];
class Membership extends Manager {
  constructor(connection) {
    super(connection);
  }
  async createMembership(data) {
    /**
     * if data is not provided then throw an error thata "data is not provided"
     * if user and organisation exist in membership then throw an error "User is already has got an invitation with this organisation"
     * if user and organisation is not found then create the membership
     */
    if (!data)
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Data is required."
      );
    let { invitedUserId, organization, role } = data;
    const licenseManager = new LicenseManagementService(organization);
    const isUserAllowed =
      await licenseManager.authorizeUserUsagePermissionInOrg(role);
    if (!isUserAllowed)
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Organisation doesn't have enough licenses to add user(s)."
      );
    // Check if the user and organisation exist in the membership
    const existingMembership = await this.Membership.findOne({
      invitedUserId,
      organization,
    });
    if (existingMembership) {
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "User is already a member of the organisation."
      );
    }
    let newMembership = new this.Membership({
      invitedUserId,
      organization,
      role,
    });
    newMembership = await newMembership.save();
    await licenseManager.utilizeUserLicenseInOrg(role);
    return newMembership.populate(population);
  }
  async getMembership(query) {
    let exist = await this.Membership.findOne(query);
    if (!exist)
      throw new APIError(
        ReasonPhrases.NOT_FOUND,
        StatusCodes.NOT_FOUND,
        "Membership not found with given query."
      );
    return exist.populate(population);
  }
  async updateMembershipInfo(id, data) {
    let membership = await this.getMembership({ _id: id });
    membership.workLocationType = data.workLocationType;
    membership.jobTitle = data.jobTitle;
    membership.salary = data.salary;
    membership.lineManagers = data.lineManagers;
    membership.leaveDaysEntitledTo = data.leaveDaysEntitledTo;
    membership.workShift.weeklyHours = data.workShift?.weeklyHours;
    membership.workShift.timeZone = data.workShift?.timeZone;
    membership.country.name = data.country?.name;
    membership.country.code = data.country?.code;
    membership = await membership.save();
    return membership.populate(population);
  }
  async updateMembershipRole(id, data) {
    let membership = await this.getMembership({ _id: id });
    membership.role = data.role;
    await membership.save();
    /** clean up refresh token to log them out soon */
    await this.User.findOneAndUpdate(
      { _id: membership.invitedUserId },
      {
        $set: {
          refreshTokens: [],
        },
      }
    );
    return membership.populate(population);
  }
  async listMembership(query, options) {
    let pagination = await this.Membership.paginate(query, {
      ...options,
      populate: population,
    });
    return pagination;
  }
  async softRemoveMembership(id) {
    const membership = this.getMembership({ _id: id });
    if (membership) {
      await this.Membership.softDelete({ _id: id });
      return membership;
    }
  }
  async restoreMembership(id) {
    const membership = await this.getMembership({ _id: id });
    if (membership) {
      await this.Membership.restore({ _id: id });
      return membership;
    }
  }
  async hardRemoveMembership(id) {
    const membership = await this.getMembership({ _id: id });
    const licenseManager = new LicenseManagementService(
      this.connection.user?.organizationId
    );
    // Condition will be implemented..
    if (membership) {
      await this.Membership.deleteOne({ _id: membership._id });
      licenseManager.utilizeUserLicenseInOrg(membership.role, -1);
      const groups = await this.Group.find({
        _id: {
          $in: membership.groups,
        },
      });
      await Promise.all(
        groups.map(async (group) => {
          let membercounts = await this.Membership.countDocuments({
            groups: group._id,
          });
          group.totalMembers = membercounts;
          await group.save();
        })
      );
      return membership;
    }
  }
}

module.exports = { Membership };
