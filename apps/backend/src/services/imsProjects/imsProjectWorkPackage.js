const { ImsProject } = require("./imsProject");
const { APIError } = require("../../helpers/errors/apiError");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const mongoose = require("mongoose");
const { mainChannel } = require("../../eventsV2/topic");
const { SERVER_EVENTS_BUS } = require("../../eventsV2/topicsName");

const population = [
  {
    path: "createdBy",
    select: "name email profileImageSrc accessPolicies jobTitle",
  },
  {
    path: "groupWorkPackage",
    select: "title type reference groupColorHex",
  },
];

class ImsProjectWorkPackage extends ImsProject {
  constructor(connection) {
    super(connection);
  }

  async validateWorkPackageNesting(data) {
    if (!data.groupWorkPackage) return;

    const parentWorkPackage = await this.ImsProjectWorkPackage.findOne({
      _id: data.groupWorkPackage,
      type: "Task Group",
      groupWorkPackage: null,
    });

    if (!parentWorkPackage) {
      throw new APIError(
        ReasonPhrases.NOT_FOUND,
        StatusCodes.NOT_FOUND,
        "Parent work package not found"
      );
    }

    // Only prevent Task Groups from being nested under other Task Groups
    if (data.type === "Task Group" && data.groupWorkPackage) {
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Task Group cannot be nested under another Task Group"
      );
    }
  }

  async getChildWorkPackages(workPackageId) {
    return this.ImsProjectWorkPackage.find({ groupWorkPackage: workPackageId });
  }

  async deleteWorkPackageRelationships(workPackageId) {
    // Delete all relationships where this work package is a parent
    await this.ImsProjectWorkPackageRelationship.deleteMany({
      parentWorkPackage: workPackageId,
    });

    // Delete all relationships where this work package is a child
    await this.ImsProjectWorkPackageRelationship.deleteMany({
      childWorkPackage: workPackageId,
    });

    // Delete all blocking relationships
    await this.ImsProjectWorkPackageRelationship.deleteMany({
      blockingWorkPackage: workPackageId,
    });

    // Delete all waiting relationships
    await this.ImsProjectWorkPackageRelationship.deleteMany({
      waitingWorkPackage: workPackageId,
    });
  }

  async createImsProjectWorkPackage(data) {
    if (!data)
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Data is required."
      );

    const existingImsProject = await this.getImsProject({
      _id: data.imsProjectId,
    });

    // Validate work package nesting
    await this.validateWorkPackageNesting(data);

    let {
      title,
      description,
      startDate,
      endDate,
      progressPercentage,
      type,
      priority,
      status,
      groupWorkPackage,
      groupColorHex,
    } = data;

    let newImsProjectWorkPackage = new this.ImsProjectWorkPackage({
      title,
      description,
      startDate,
      endDate,
      status,
      progressPercentage,
      type,
      priority,
      groupWorkPackage,
      groupColorHex,
      imsProjectId: data.imsProjectId,
      organization: this.connection.user.organizationId,
      createdBy: this.connection.user._id,
    });

    newImsProjectWorkPackage = await newImsProjectWorkPackage.save();
    newImsProjectWorkPackage = await newImsProjectWorkPackage.populate(
      population
    );

    if (type == "Milestone") {
      mainChannel.topic(SERVER_EVENTS_BUS.NEW_MILESTONE_CREATEED).emit({
        accessControl: this.connection,
        imsProjectWorkPackage: newImsProjectWorkPackage,
        imsProject: existingImsProject,
      });
    }
    if (type == "Task") {
      mainChannel.topic(SERVER_EVENTS_BUS.NEW_TASK_CREATED).emit({
        accessControl: this.connection,
        imsProjectWorkPackage: newImsProjectWorkPackage,
        imsProject: existingImsProject,
      });
    }

    return newImsProjectWorkPackage;
  }

  async getImsProjectWorkPackage(query) {
    let exist = await this.ImsProjectWorkPackage.findOne(query);
    if (!exist)
      throw new APIError(
        ReasonPhrases.NOT_FOUND,
        StatusCodes.NOT_FOUND,
        "iMS Project work package not found with given query."
      );
    return exist.populate(population);
  }

  async updateImsProjectWorkPackage(id, data) {
    const { projectId } = data;
    let project = await this.getImsProject({ _id: projectId });
    let imsProjectWorkPackage = await this.getImsProjectWorkPackage({
      _id: id,
    });

    // Validate work package nesting if groupWorkPackage is being updated

    await this.validateWorkPackageNesting({
      type: imsProjectWorkPackage.type,
      groupWorkPackage: data.groupWorkPackage,
    });

    let updatediMSProjectWorkPackage =
      await this.ImsProjectWorkPackage.findOneAndUpdate(
        { _id: id },
        {
          $set: {
            ...data,
          },
        },
        { new: true }
      );
    updatediMSProjectWorkPackage = await updatediMSProjectWorkPackage.populate(
      population
    );
    if (
      updatediMSProjectWorkPackage.type == "Task" &&
      updatediMSProjectWorkPackage.progressPercentage == 100
    ) {
      mainChannel.topic(SERVER_EVENTS_BUS.IMS_PROJECT_TASK_COMPLETE).emit({
        accessControl: this.connection,
        imsProjectWorkPackage: updatediMSProjectWorkPackage,
      });
    }

    if (
      updatediMSProjectWorkPackage.type == "Milestone" &&
      updatediMSProjectWorkPackage.progressPercentage == 100
    ) {
      mainChannel.topic(SERVER_EVENTS_BUS.MILESTONE_COMPLETE).emit({
        accessControl: this.connection,
        imsProjectWorkPackage: updatediMSProjectWorkPackage,
      });
    }
    return updatediMSProjectWorkPackage;
  }

  async listImsProjectWorkPackage(query, options) {
    const pagination = await this.ImsProjectWorkPackage.paginateByOrg(
      this.connection.user.organizationId,
      query,
      { ...options, populate: population }
    );
    return pagination;
  }

  async softRemoveImsProjectWorkPackage(id) {
    const imsProjectWorkPackage = await this.getImsProjectWorkPackage({
      _id: id,
    });
    if (imsProjectWorkPackage) {
      await this.ImsProjectWorkPackage.softDelete({
        _id: id,
      });
      return imsProjectWorkPackage;
    }
  }

  async restoreImsProjectWorkPackage(id) {
    const imsProjectWorkPackage = await this.getImsProjectWorkPackage({
      _id: id,
    });
    if (imsProjectWorkPackage) {
      await this.ImsProjectWorkPackage.restore({ _id: id });
      return imsProjectWorkPackage;
    }
  }

  async hardRemoveImsProjectWorkPackage(id) {
    let imsProjectWorkPackage = await this.getImsProjectWorkPackage({
      _id: id,
    });

    if (imsProjectWorkPackage) {
      // Delete all relationships associated with this work package
      await this.deleteWorkPackageRelationships(id);

      // Delete the work package itself
      await this.ImsProjectWorkPackage.deleteOne({ _id: id });

      imsProjectWorkPackage = await imsProjectWorkPackage.populate(population);
    }
    if (imsProjectWorkPackage.type == "Milestone") {
      mainChannel.topic(SERVER_EVENTS_BUS.MILESTONE_DELETED).emit({
        accessControl: this.connection,
        imsProjectWorkPackage,
      });
    }
    return imsProjectWorkPackage;
  }
}

module.exports = { ImsProjectWorkPackage };
