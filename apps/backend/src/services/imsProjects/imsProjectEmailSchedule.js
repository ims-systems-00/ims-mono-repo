const { Manager } = require("./manager");
const { APIError } = require("../../helpers/errors/apiError");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const mongoose = require("mongoose");
const { ImsProject } = require("./imsProject");
const emailHandler = require("../../email/sendMail");

const population = [
  // {
  //   path: "userId",
  //   select: "name email profileImageSrc accessPolicies jobTitle",
  // },
];
class ImsProjectEmailSchedule extends ImsProject {
  constructor(connection) {
    super(connection);
  }

  async sendScheduledEmails() {
    const now = new Date();
    const emailsToSend = await this.ImsProjectEmailSchedule.find({
      sent: false,
    });

    for (const email of emailsToSend) {
      let shouldSend = false;

      switch (email.scheduleType) {
        case "daily":
          shouldSend =
            email.sendAt.getHours() === now.getHours() &&
            email.sendAt.getMinutes() === now.getMinutes();
          break;
        case "weekly":
          shouldSend =
            email.sendAt.getDay() === now.getDay() &&
            email.sendAt.getHours() === now.getHours() &&
            email.sendAt.getMinutes() === now.getMinutes();
          break;
        case "monthly":
          shouldSend =
            email.sendAt.getDate() === now.getDate() &&
            email.sendAt.getHours() === now.getHours() &&
            email.sendAt.getMinutes() === now.getMinutes();
          break;
        case "yearly":
          shouldSend =
            email.sendAt.getMonth() === now.getMonth() &&
            email.sendAt.getDate() === now.getDate() &&
            email.sendAt.getHours() === now.getHours() &&
            email.sendAt.getMinutes() === now.getMinutes();
          break;
      }

      if (shouldSend) {
        try {
          await emailHandler.sendMail(email.type, email.to, email.payload);
        } catch (error) {
          console.error("Error sending email:", error);
        }
      }
    }
  }

  async createImsProjectEmailSchedule(data) {
    if (!data)
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Data is required."
      );
    await this.getImsProject({ _id: data.imsProjectId });
    let { to, type, payload, sendAt, sent, scheduleType } = data;
    let newImsProjectEmailSchedule = new this.ImsProjectEmailSchedule({
      imsProjectId: data.imsProjectId,
      to,
      type,
      payload,
      sendAt,
      sent,
      scheduleType,
      organization: this.connection.user.organizationId,
    });
    newImsProjectEmailSchedule = await newImsProjectEmailSchedule.save();
    return newImsProjectEmailSchedule.populate(population);
  }

  async getImsProjectEmailSchedule(query) {
    let exist = await this.ImsProjectEmailSchedule.findOne(query);
    if (!exist)
      throw new APIError(
        ReasonPhrases.NOT_FOUND,
        StatusCodes.NOT_FOUND,
        "iMS Project Email Schedule not found with given query."
      );
    return exist.populate(population);
  }
  async updateImsProjectEmailSchedule(id, data) {
    const { projectId } = data;
    await this.getImsProject({ _id: projectId });
    await this.getImsProjectEmailSchedule({ _id: id });
    let updatediMSProjectEmailSchedule =
      await this.ImsProjectEmailSchedule.findByIdAndUpdate(
        { _id: id },
        {
          $set: {
            ...data,
          },
        },
        { new: true }
      );
    updatediMSProjectEmailSchedule =
      await updatediMSProjectEmailSchedule.populate(population);
    return updatediMSProjectEmailSchedule;
  }
  async listImsProjectEmailSchedule(query, options) {
    const aggregate = this.ImsProjectEmailSchedule.aggregate();
    aggregate.match({
      ...query,
      organization: new mongoose.Types.ObjectId(
        this.connection.user.organizationId
      ),
    });
    const pagination = await this.ImsProjectEmailSchedule.aggregatePaginate(
      aggregate,
      options
    );
    return pagination;
  }
  async softRemoveImsProjectEmailSchedule(id) {
    const imsProjectEmailSchedule = this.getImsProjectEmailSchedule({
      _id: id,
    });
    if (imsProjectEmailSchedule) {
      await this.ImsProjectEmailSchedule.softDelete({ _id: id });
      return imsProjectEmailSchedule;
    }
  }
  async restoreImsProjectEmailSchedule(id) {
    const imsProjectEmailSchedule = await this.getImsProjectEmailSchedule({
      _id: id,
    });
    if (imsProjectEmailSchedule) {
      await this.ImsProjectEmailSchedule.restore({ _id: id });
      return imsProjectEmailSchedule;
    }
  }
  async hardRemoveImsProjectEmailSchedule(id) {
    const imsProjectEmailSchedule = await this.getImsProjectEmailSchedule({
      _id: id,
    });
    if (imsProjectEmailSchedule) {
      await this.ImsProjectEmailSchedule.deleteOne({ _id: id });
      return imsProjectEmailSchedule;
    }
  }
}

module.exports = { ImsProjectEmailSchedule };
