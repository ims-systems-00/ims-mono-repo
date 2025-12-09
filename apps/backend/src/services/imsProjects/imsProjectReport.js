const { Manager } = require("./manager");
const { APIError } = require("../../helpers/errors/apiError");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const mongoose = require("mongoose");
const { ImsProject } = require("./imsProject");

const population = [
  {
    path: "createdBy",
    select: "name email profileImageSrc accessPolicies jobTitle",
  },
];
class ImsProjectReport extends ImsProject {
  constructor(connection) {
    super(connection);
  }
  async createImsProjectReport(data) {
    if (!data)
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Data is required."
      );
    await this.getImsProject({ _id: data.imsProjectId });
    let { title, sections, interval } = data;
    let newImsProjectReport = new this.ImsProjectReport({
      imsProjectId: data.imsProjectId,
      title,
      sections,
      interval,
      organization: this.connection.user.organizationId,
      createdBy: this.connection.user._id,
    });
    newImsProjectReport = await newImsProjectReport.save();
    return newImsProjectReport.populate(population);
  }
  async getImsProjectReport(query) {
    let exist = await this.ImsProjectReport.findOne(query);
    if (!exist)
      throw new APIError(
        ReasonPhrases.NOT_FOUND,
        StatusCodes.NOT_FOUND,
        "iMS Project Report not found with given query."
      );
    return exist.populate(population);
  }
  async updateImsProjectReport(id, data) {
    const { projectId } = data;
    let project = await this.getImsProject({ _id: projectId });
    let imsProjectReport = await this.getImsProjectReport({ _id: id });
    let updatediMSProjectReport = await this.ImsProjectReport.findByIdAndUpdate(
      { _id: id },
      {
        $set: {
          ...data,
        },
      },
      { new: true }
    );
    updatediMSProjectReport = await updatediMSProjectReport.populate(
      population
    );
    return updatediMSProjectReport;
  }
  async listImsProjectReport(query, options) {
    const aggregate = this.ImsProjectReport.aggregate();
    aggregate.match({
      ...query,
      organization: new mongoose.Types.ObjectId(
        this.connection.user.organizationId
      ),
      "deleteMarker.status": false,
    });
    const pagination = await this.ImsProjectReport.aggregatePaginate(
      aggregate,
      options
    );
    return pagination;
  }
  async softRemoveImsProjectReport(id) {
    const imsProjectReport = await this.getImsProjectReport({ _id: id });
    if (imsProjectReport) {
      await this.ImsProjectReport.softDelete({ _id: id });
      return imsProjectReport;
    }
  }
  async restoreImsProjectReport(id) {
    const imsProjectReport = await this.getImsProjectReport({ _id: id });
    if (imsProjectReport) {
      await this.ImsProjectReport.restore({ _id: id });
      return imsProjectReport;
    }
  }
  async hardRemoveImsProjectReport(id) {
    const imsProjectReport = await this.getImsProjectReport({ _id: id });
    if (imsProjectReport) {
      await this.ImsProjectReport.deleteOne({ _id: id });
      return imsProjectReport;
    }
  }
}

module.exports = { ImsProjectReport };
