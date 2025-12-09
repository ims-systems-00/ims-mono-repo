const { APIError } = require("../../helpers/errors/apiError");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const { ImsProject } = require("./imsProject");
const { mainChannel } = require("../../eventsV2/topic");
const { SERVER_EVENTS_BUS } = require("../../eventsV2/topicsName");

const population = [
  {
    path: "userId",
    select: "name email profileImageSrc jobTitle",
  },
  {
    path: "createdBy",
    select: "name email profileImageSrc jobTitle",
  },
];
class ImsProjectMemberShip extends ImsProject {
  constructor(connection) {
    super(connection);
  }
  async createImsProjectMemberShip(data) {
    if (!data)
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Data is required."
      );

    const existingImsProject = await this.getImsProject({
      _id: data.imsProjectId,
    });
    let { userId, role, raci, title, responsibility } = data;
    const existingProjectMemberShip = await this.ImsProjectMemberShip.findOne({
      userId: userId,
      imsProjectId: data.imsProjectId,
    });
    if (existingProjectMemberShip) {
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "User is already a member of this project."
      );
    }
    let newImsProject = new this.ImsProjectMemberShip({
      userId,
      role,
      raci,
      title,
      responsibility,
      imsProjectId: data.imsProjectId,
      organization: this.connection.user.organizationId,
      createdBy: this.connection.user._id,
    });
    newImsProject = await newImsProject.save();
    await newImsProject.populate(population);
    mainChannel.topic(SERVER_EVENTS_BUS.NEW_MEMBER_ADDED_INTO_PROJECT).emit({
      accessControl: this.connection,
      imsProjectMembership: newImsProject,
      imsProject: existingImsProject,
    });
    return newImsProject;
  }

  async getImsProjectMemberShip(query) {
    let exist = await this.ImsProjectMemberShip.findOne(query);
    if (!exist)
      throw new APIError(
        ReasonPhrases.NOT_FOUND,
        StatusCodes.NOT_FOUND,
        "iMS Project membership not found with given query."
      );
    return exist.populate(population);
  }
  async updateImsProjectMemberShip(id, data) {
    const { projectId } = data;
    let project = await this.getImsProject({ _id: projectId });
    let imsProjectMemberShip = await this.getImsProjectMemberShip({ _id: id });
    let updatediMSProjectMemberShip =
      await this.ImsProjectMemberShip.findByIdAndUpdate(
        { _id: id },
        {
          $set: {
            ...data,
          },
        },
        { new: true }
      );
    updatediMSProjectMemberShip = await updatediMSProjectMemberShip.populate(
      population
    );
    return updatediMSProjectMemberShip;
  }
  async listImsProjectMemberShip(query, options) {
    const pagination = await await this.ImsProjectMemberShip.paginateByOrg(
      this.connection.user.organizationId,
      query,
      {
        ...options,
        populate: population,
      }
    );
    return pagination;
  }
  async softRemoveImsProjectMemberShip(id) {
    const imsProjectMemberShip = await this.getImsProjectMemberShip({
      _id: id,
    });
    if (imsProjectMemberShip) {
      await this.ImsProjectMemberShip.softDelete({
        _id: id,
      });
      return imsProjectMemberShip;
    }
  }
  async restoreImsProjectMemberShip(id) {
    const imsProjectMemberShip = await this.getImsProjectMemberShip({
      _id: id,
    });
    if (imsProjectMemberShip) {
      await this.ImsProjectMemberShip.restore({
        _id: id,
      });
      return imsProjectMemberShip;
    }
  }
  async hardRemoveImsProjectMemberShip(id) {
    const imsProjectMemberShip = await this.getImsProjectMemberShip({
      _id: id,
    });
    if (imsProjectMemberShip) {
      await this.ImsProjectMemberShip.deleteOne({
        _id: id,
      });
      return imsProjectMemberShip;
    }
  }
}

module.exports = { ImsProjectMemberShip };
