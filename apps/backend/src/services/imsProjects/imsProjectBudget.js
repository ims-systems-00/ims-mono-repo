const { Manager } = require("./manager");
const { APIError } = require("../../helpers/errors/apiError");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const mongoose = require("mongoose");
const { ImsProject } = require("./imsProject");
const { mainChannel } = require("../../eventsV2/topic");
const { SERVER_EVENTS_BUS } = require("../../eventsV2/topicsName");

const population = [
  {
    path: "createdBy",
    select: "name email profileImageSrc jobTitle",
  },
];
class ImsProjectBudget extends ImsProject {
  constructor(connection) {
    super(connection);
  }
  async createImsProjectBudget(data) {
    if (!data)
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Data is required."
      );
    await this.getImsProject({ _id: data.imsProjectId });
    let { title, unitPrice, quantity, currency } = data;
    let newImsProjectBudget = new this.ImsProjectBudget({
      imsProjectId: data.imsProjectId,
      title,
      unitPrice,
      quantity,
      currency,
      organization: this.connection.user.organizationId,
      createdBy: this.connection.user._id,
    });
    newImsProjectBudget = await newImsProjectBudget.save();
    newImsProjectBudget = await newImsProjectBudget.populate(population);
    mainChannel.topic(SERVER_EVENTS_BUS.IMS_PROJECT_BUDGET_ADDED).emit({
      accessControl: this.connection,
      imsProjectBudget: newImsProjectBudget,
    });
    return newImsProjectBudget;
  }
  async getImsProjectBudget(query) {
    let exist = await this.ImsProjectBudget.findOne(query);
    if (!exist)
      throw new APIError(
        ReasonPhrases.NOT_FOUND,
        StatusCodes.NOT_FOUND,
        "iMS Project budget not found with given query."
      );
    return exist.populate(population);
  }
  async updateImsProjectBudget(id, data) {
    const { projectId } = data;
    let project = await this.getImsProject({ _id: projectId });
    let imsProjectBudget = await this.getImsProjectBudget({ _id: id });
    Object.keys(data).map((key) => {
      imsProjectBudget[key] = data[key];
    });
    let updatediMSProjectBudget = await imsProjectBudget.save();
    updatediMSProjectBudget = await updatediMSProjectBudget.populate(
      population
    );
    mainChannel.topic(SERVER_EVENTS_BUS.IMS_PROJECT_BUDGET_UPDATED).emit({
      accessControl: this.connection,
      imsProjectBudget: updatediMSProjectBudget,
    });
    return updatediMSProjectBudget;
  }
  async listImsProjectBudget(query, options) {
    const pagination = await this.ImsProjectBudget.paginateByOrg(
      this.connection.user.organizationId,
      query,
      {
        ...options,
        populate: population,
      }
    );

    return pagination;
  }
  async softRemoveImsProjectBudget(id) {
    const imsProjectBudget = await this.getImsProjectBudget({ _id: id });
    if (imsProjectBudget) {
      await this.ImsProjectBudget.softDelete({ _id: id });
      return imsProjectBudget;
    }
  }
  async restoreImsProjectBudget(id) {
    const imsProjectBudget = await this.getImsProjectBudget({ _id: id });
    if (imsProjectBudget) {
      await this.ImsProjectBudget.restore({ _id: id });
      return imsProjectBudget;
    }
  }
  async hardRemoveImsProjectBudget(id) {
    const imsProjectBudget = await this.getImsProjectBudget({ _id: id });
    if (imsProjectBudget) {
      await this.ImsProjectBudget.deleteOne({ _id: id });
      await imsProjectBudget.populate(population);
      mainChannel.topic(SERVER_EVENTS_BUS.IMS_PROJECT_BUDGET_DELETED).emit({
        accessControl: this.connection,
        imsProjectBudget,
      });
    }
    return imsProjectBudget;
  }
}

module.exports = { ImsProjectBudget };
