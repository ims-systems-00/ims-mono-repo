const { Manager } = require("./manager");
const { APIError } = require("../../helpers/errors/apiError");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const mongoose = require("mongoose");

const population = [
  {
    path: "organization",
    select: "name logo",
  },
];
class CcLocation extends Manager {
  constructor(connection) {
    super(connection);
  }
  async createCcLocation(data) {
    if (!data)
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Data is required."
      );
    let {
      locationRef,
      addressInMap,
      addressBuilding,
      addressStreet,
      addressCity,
      addressPostCode,
      addressStateProvince,
      addressCountry,
      descriptionOfActivities,
      ghgAssessmentInclusion,
      comment,
    } = data;
    let newCcLocation = new this.CcLocation({
      locationRef,
      addressInMap,
      addressBuilding,
      addressStreet,
      addressCity,
      addressPostCode,
      addressStateProvince,
      addressCountry,
      descriptionOfActivities,
      ghgAssessmentInclusion,
      comment,
      organization: this.connection.user.organizationId,
    });
    newCcLocation = await newCcLocation.save();
    return newCcLocation.populate(population);
  }
  async getCcLocation(query) {
    let exist = await this.CcLocation.findOne(query);
    if (!exist)
      throw new APIError(
        ReasonPhrases.NOT_FOUND,
        StatusCodes.NOT_FOUND,
        "cc location not found with given query."
      );
    return exist.populate(population);
  }
  async updateCcLocation(id, data) {
    let ccLocation = await this.getCcLocation({ _id: id });
    let updatedCcLocation = await this.CcLocation.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          ...data,
        },
      },
      { new: true }
    );
    updatedCcLocation = await updatedCcLocation.populate(population);
    return updatedCcLocation;
  }
  async listCcLocation(query, options) {
    const aggregate = this.CcLocation.aggregate();
    aggregate.match({
      ...query,
      organization: new mongoose.Types.ObjectId(
        this.connection.user.organizationId
      ),
    });
    const pagination = await this.CcLocation.aggregatePaginate(
      aggregate,
      options
    );
    return pagination;
  }
  async softRemoveCcLocation(id) {
    const ccLocation = this.getCcLocation({ _id: id });
    if (ccLocation) {
      await this.CcLocation.softDelete({ _id: id });
      return ccLocation;
    }
  }
  async restoreCcLocation(id) {
    const ccLocation = await this.getCcLocation({ _id: id });
    if (ccLocation) {
      await this.CcLocation.restore({ _id: id });
      return ccLocation;
    }
  }
  async hardRemoveCcLocation(id) {
    const ccLocation = await this.getCcLocation({ _id: id });
    if (ccLocation) {
      await this.CcLocation.deleteOne({ _id: id });
      return ccLocation;
    }
  }
}

module.exports = { CcLocation };
