const { Manager } = require("./manager");
const { APIError } = require("../../helpers/errors/apiError");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const mongoose = require("mongoose");

const population = [
  {
    path: "createdBy",
    select: "name email profileImageSrc accessPolicies jobTitle",
  },
  {
    path: "organization",
    select: "name logo",
  },
];
class ImsForm extends Manager {
  constructor(connection) {
    super(connection);
  }
  async createImsForm(data) {
    if (!data)
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Data is required."
      );
    let { title, description, theme } = data;
    let newImsForm = new this.ImsForm({
      title,
      description,
      organization: this.connection.user.organizationId,
      createdBy: this.connection.user._id,
    });
    newImsForm = await newImsForm.save();
    return newImsForm.populate(population);
  }
  async getImsForm(query) {
    let exist = await this.ImsForm.findOne(query);
    if (!exist)
      throw new APIError(
        ReasonPhrases.NOT_FOUND,
        StatusCodes.NOT_FOUND,
        "iMS Form not found with given query."
      );
    return exist.populate(population);
  }
  async updateImsForm(id, data) {
    await this.getImsForm({ _id: id });
    let imsForm = await this.ImsForm.findOneAndUpdate(
      { _id: id },
      { $set: { ...data } },
      { new: true }
    );
    return imsForm.populate(population);
  }
  async listImsForm(query, options) {
    const aggregate = this.ImsForm.aggregate();
    aggregate.match({
      ...query,
      organization: new mongoose.Types.ObjectId(
        this.connection.user.organizationId
      ),
    });
    const pagination = await this.ImsForm.aggregatePaginate(aggregate, options);
    return pagination;
  }
  async softRemoveImsForm(id) {
    const imsForm = this.getImsForm({ _id: id });
    if (imsForm) {
      await this.ImsForm.softDelete({ _id: id });
      return imsForm;
    }
  }
  async restoreImsForm(id) {
    const imsForm = await this.getImsForm({ _id: id });
    if (imsForm) {
      await this.ImsForm.restore({ _id: id });
      return imsForm;
    }
  }
  async hardRemoveImsForm(id) {
    const imsForm = await this.getImsForm({ _id: id });
    if (imsForm) {
      await this.ImsForm.deleteOne({ _id: imsForm._id });
      return imsForm;
    }
  }
}

module.exports = { ImsForm };
