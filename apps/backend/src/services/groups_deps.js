const IamGroupModel = require("../models/mongodb/system/ourIms/iamGroup");
const LicenseManagementService = require("../services/licenseManager");
const { imsPaginationFormated, Filters } = require("../services/utility");
const { initGroupDashboard } = require("../initialize/initDashBoard");
const { APIError } = require("../helpers/errors/apiError");
const { ReasonPhrases, StatusCodes } = require("http-status-codes");
const { basicRoleScopedFilter } = require("../queries");
const { ROLES } = require("@ims-systems-00/ims-core/lib/constants");

class GroupDepsService {
  constructor(connection) {
    this.connection = connection;
    this.IamGroup = IamGroupModel(connection);
    this.imsPaginationFormated = imsPaginationFormated;
    this.initGroupDashboard = initGroupDashboard;
  }
  async createIamGroup(data) {
    const licenseManagement = new LicenseManagementService(
      this.connection.user.organizationId
    );
    let createdIamGroup = await this.IamGroup.create({
      organization: this.connection.user.organizationId,
      name: data.name,
      type: data.type,
      responsibility: data.responsibility,
      details: {
        operatingLocation: data.operatingLocation,
        standards: data.standards,
      },
    });
    createdIamGroup = await createdIamGroup.save();
    await this.initGroupDashboard(this.connection)(createdIamGroup);
    await licenseManagement.utilizeBusinessUnitLicenseInOrg();
    return this.IamGroup.populateIamGroup(createdIamGroup);
  }
  async getIamGroup(id) {
    let iamGroup = await this.IamGroup.findOne({ _id: id });
    if (!iamGroup)
      throw new APIError(
        ReasonPhrases.NOT_FOUND,
        StatusCodes.NOT_FOUND,
        "group not found with given id."
      );
    return iamGroup;
  }

  async updateIamGroupDescription(id, data) {
    let iamGroup = await this.getIamGroup(id);
    iamGroup.name = data.name;
    iamGroup.details.operatingLocation = data.operatingLocation;
    iamGroup.details.standards = data.standards;
    iamGroup.responsibility = data.responsibility;
    await iamGroup.save();
    return this.IamGroup.populateIamGroup(iamGroup);
  }
  async deleteIamGroup(id) {
    let iamGroup = await this.getIamGroup(id);
    if (iamGroup) {
      await this.IamGroup.deleteOne({ _id: id });
    }
    return iamGroup;
  }
  getListingQuery() {
    const specificGroupMatch = {
      _id: this.connection.user.groupId,
    };

    let finalFilter = {};
    if (
      this.connection.user.role === ROLES.SUPER_ADMIN ||
      this.connection.user.role === ROLES.INTERNAL_AUDITOR ||
      this.connection.user.role === ROLES.EXTERNAL_AUDITOR
    ) {
      /** no filer logic rquired, fetch everything by default */
    }
    if (
      this.connection.user.role === ROLES.HEAD_OF_SERVICE ||
      this.connection.user.role === ROLES.BASIC_USER ||
      this.connection.user.role === ROLES.EXTERNAL_USER
    ) {
      finalFilter = { ...specificGroupMatch };
    }
    return finalFilter;
  }
  async listGroupByOrg(query, options) {
    let pagination = await this.IamGroup.paginateByOrg(
      this.connection?.user?.organizationId,
      { ...query, ...this.getListingQuery() },
      options
    );
    let iamGroups = pagination.docs;
    iamGroups = await Promise.all(
      iamGroups.map((iamGroup) => this.IamGroup.populateIamGroup(iamGroup))
    );
    return { iamGroups, pagination: this.imsPaginationFormated(pagination) };
  }
}

module.exports = GroupDepsService;
