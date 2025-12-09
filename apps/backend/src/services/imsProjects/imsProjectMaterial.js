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
class ImsProjectMaterial extends ImsProject {
  constructor(connection) {
    super(connection);
  }
  async createImsProjectMaterial(data) {
    if (!data)
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Data is required."
      );
    await this.getImsProject({ _id: data.imsProjectId });
    const {
      name,
      description,
      type,
      color,
      length,
      model,
      address,
      lat,
      lng,
      building,
      block,
      level,
      manufacturer,
      supplier,
    } = data;
    let newImsProjectMaterial = new this.ImsProjectMaterial({
      imsProjectId: data.imsProjectId,
      name,
      description,
      type,
      color,
      length,
      model,
      address,
      lat,
      lng,
      building,
      block,
      level,
      manufacturer,
      supplier,
      organization: this.connection.user.organizationId,
      createdBy: this.connection.user._id,
    });
    newImsProjectMaterial = await newImsProjectMaterial.save();
    newImsProjectMaterial = await newImsProjectMaterial.populate(population);
    return newImsProjectMaterial;
  }
  async getImsProjectMaterial(query) {
    let exist = await this.ImsProjectMaterial.findOne(query);
    if (!exist)
      throw new APIError(
        ReasonPhrases.NOT_FOUND,
        StatusCodes.NOT_FOUND,
        "iMS Project material not found with given query."
      );
    return exist.populate(population);
  }
  async updateImsProjectMaterial(id, data) {
    const { projectId } = data;
    await this.getImsProject({ _id: projectId });
    let imsProjectMaterial = await this.getImsProjectMaterial({ _id: id });
    imsProjectMaterial = await this.ImsProjectMaterial.findOneAndUpdate(
      { _id: id },
      { $set: { ...data } },
      { new: true }
    );

    imsProjectMaterial = await imsProjectMaterial.populate(population);

    return imsProjectMaterial;
  }
  async listImsProjectMaterial(query, options) {
    const pagination = await this.ImsProjectMaterial.paginateByOrg(
      this.connection.user.organizationId,
      query,
      {
        ...options,
        populate: population,
      }
    );

    return pagination;
  }
  async softRemoveImsProjectMaterial(id) {
    const ImsProjectMaterial = await this.getImsProjectMaterial({ _id: id });
    if (ImsProjectMaterial) {
      await this.ImsProjectMaterial.softDelete({ _id: id });
      return ImsProjectMaterial;
    }
  }
  async restoreImsProjectMaterial(id) {
    const ImsProjectMaterial = await this.getImsProjectMaterial({ _id: id });
    if (ImsProjectMaterial) {
      await this.ImsProjectMaterial.restore({ _id: id });
      return ImsProjectMaterial;
    }
  }
  async hardRemoveImsProjectMaterial(id) {
    const ImsProjectMaterial = await this.getImsProjectMaterial({ _id: id });
    if (ImsProjectMaterial) {
      await this.ImsProjectMaterial.deleteOne({ _id: id });
      await ImsProjectMaterial.populate(population);
    }
    return ImsProjectMaterial;
  }
}

module.exports = { ImsProjectMaterial };
