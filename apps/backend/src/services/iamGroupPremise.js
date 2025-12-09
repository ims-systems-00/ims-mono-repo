const IamGroupPremiseModel = require("../models/mongodb/system/ourIms/iamGroupPremise");
const { imsPaginationFormated, Filters } = require("../services/utility");
const { APIError } = require("../helpers/errors/apiError");
const { ReasonPhrases, StatusCodes } = require("http-status-codes");
const { basicRoleScopedFilter } = require("../queries");
class GroupPremisesService {
  constructor(connection) {
    this.connection = connection;
    this.IamGroupPremise = IamGroupPremiseModel(connection);
    this.imsPaginationFormated = imsPaginationFormated;
  }
  async createIamGroupPremise(data) {
    let createdPremise = await this.IamGroupPremise.create({
      organization: this.connection.user.organizationId,
      name: data.name,
      groups: data.groups,
      location: data.location,
      address: data.address,
      created: {
        on: Date.now(),
        by: data.createdBy,
      },
    });
    createdPremise = await createdPremise.save();
    return this.IamGroupPremise.populatePremise(createdPremise);
  }
  async getIamGroupPremise(id) {
    let iamGroupPremise = await this.IamGroupPremise.findOne({ _id: id });
    if (!iamGroupPremise)
      throw new APIError(
        ReasonPhrases.NOT_FOUND,
        StatusCodes.NOT_FOUND,
        "group not found with given id."
      );
    return this.IamGroupPremise.populatePremise(iamGroupPremise);
  }

  async updateIamGroupPremise(id, data) {
    let iamGroupPremise = await this.getIamGroupPremise(id);
    iamGroupPremise.groups = data.groups;
    iamGroupPremise.name = data.name;
    iamGroupPremise.location = data.location;
    iamGroupPremise.address = data.address;
    await iamGroupPremise.save();
    return this.IamGroupPremise.populatePremise(iamGroupPremise);
  }
  async deleteIamGroupPremise(id) {
    let iamGroupPremise = await this.getIamGroupPremise(id);
    if (iamGroupPremise) {
      await this.IamGroupPremise.deleteOne({ _id: id });
    }
    return iamGroupPremise;
  }
  async listGroupPremisesByOrg(query, options) {
    let pagination = await this.IamGroupPremise.paginateByOrg(
      this.connection?.user?.organizationId,
      { ...query, ...basicRoleScopedFilter(this.connection) },
      options
    );
    let iamGroupPremises = pagination.docs;
    iamGroupPremises = await Promise.all(
      iamGroupPremises.map((iamPremise) =>
        this.IamGroupPremise.populatePremise(iamPremise)
      )
    );
    return {
      iamGroupPremises,
      pagination: this.imsPaginationFormated(pagination),
    };
  }
  async attachGroup(id, data) {
    let iamGroupPremise = await this.getIamGroupPremise(id);
    if (iamGroupPremise.groups.includes(data.group))
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "This group is already attached."
      );
    // iamGroupPremise.groups = data.group;
    iamGroupPremise.groups = [...iamGroupPremise.groups, data.group];
    await iamGroupPremise.save();
    return this.IamGroupPremise.populatePremise(iamGroupPremise);
  }
}

module.exports = GroupPremisesService;
