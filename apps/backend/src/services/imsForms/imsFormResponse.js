const { Manager } = require("./manager");
const { APIError } = require("../../helpers/errors/apiError");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const { ImsForm } = require("./imsForm");
const mongoose = require("mongoose");

const population = [
  {
    path: "organization",
    select: "name logo",
  },
];
class ImsFormResponse extends ImsForm {
  constructor(connection) {
    super(connection);
  }
  async createImsFormResponse(data) {
    if (!data)
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Data is required."
      );
    await this.getImsForm({ _id: data.formId });
    let { formId, formElementId, formSubmissionId, responses } = data;
    let newImsFormResponse = new this.ImsFormResponse({
      formId,
      formElementId,
      formSubmissionId,
      responses,
      organization: this.connection.user.organizationId,
    });
    newImsFormResponse = await newImsFormResponse.save();
    return newImsFormResponse.populate(population);
  }
  async getImsFormResponse(query) {
    let exist = await this.ImsFormResponse.findOne(query);
    if (!exist)
      throw new APIError(
        ReasonPhrases.NOT_FOUND,
        StatusCodes.NOT_FOUND,
        "iMS Form response not found with given query."
      );
    return exist.populate(population);
  }
  async updateImsFormResponse(id, data) {
    const { formId } = data;
    await this.getImsForm({ _id: formId });
    await this.getImsFormResponse({ _id: id });
    let imsFormResponse = await this.ImsFormResponse.findOneAndUpdate(
      { _id: id },
      { $set: { ...data } },
      { new: true }
    );
    return imsFormResponse.populate(population);
  }
  async listImsFormResponse(query, options) {
    const aggregate = this.ImsFormResponse.aggregate();
    aggregate.match({
      ...query,
      organization: new mongoose.Types.ObjectId(
        this.connection.user.organizationId
      ),
    });
    const pagination = await this.ImsFormResponse.aggregatePaginate(
      aggregate,
      options
    );
    return pagination;
  }
  async softRemoveImsFormResponse(id) {
    const imsFormResponse = this.getImsFormResponse({ _id: id });
    if (imsFormResponse) {
      await this.ImsFormResponse.softDelete({ _id: id });
      return imsFormResponse;
    }
  }
  async restoreImsFormResponse(id) {
    const imsFormResponse = await this.getImsFormResponse({ _id: id });
    if (imsFormResponse) {
      await this.ImsFormResponse.restore({ _id: id });
      return imsFormResponse;
    }
  }
  async hardRemoveImsFormResponse(id) {
    const imsFormResponse = await this.getImsFormResponse({ _id: id });
    if (imsFormResponse) {
      await this.ImsFormResponse.deleteOne({ _id: id });
      return imsFormResponse;
    }
  }
}

module.exports = { ImsFormResponse };
