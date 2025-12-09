const { Manager } = require("./manager");
const { APIError } = require("../../helpers/errors/apiError");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const { FileManager } = require("../../helpers/fileManager");

const population = [
  {
    path: "organization",
    select: "name logo",
  },
  {
    path: "createdBy",
    select: "name profileImageSrc",
  },
];
class Attachment extends Manager {
  constructor(connection) {
    super(connection);
    this.fileManager = new FileManager(connection);
  }
  async createAttachment(data) {
    if (!data)
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Data is required."
      );
    let { moduleType, module, fileMetaInfo } = data;
    let newAttachment = new this.Attachment({
      moduleType,
      module,
      fileMetaInfo,
      organization: this.connection.user.organizationId,
      createdBy: this.connection.user._id,
    });
    newAttachment = await newAttachment.save();
    return newAttachment.populate(population);
  }
  async getAttachment(query) {
    let exist = await this.Attachment.findOne(query);
    if (!exist)
      throw new APIError(
        ReasonPhrases.NOT_FOUND,
        StatusCodes.NOT_FOUND,
        "attachment not found with given query."
      );
    return exist.populate(population);
  }
  async listAttachment(query, options) {
    const pagination = await this.Attachment.paginateByOrg(
      this.connection.user.organizationId,
      query,
      { ...options, populate: population }
    );
    return pagination;
  }
  async softRemoveAttachment(id) {
    const attachment = this.getAttachment({ _id: id });
    if (attachment) {
      await this.Attachment.softDelete({ _id: id });
      return attachment;
    }
  }
  async restoreAttachment(id) {
    const attachment = await this.getAttachment({ _id: id });
    if (attachment) {
      await this.Attachment.restore({ _id: id });
      return attachment;
    }
  }
  async hardRemoveAttachment(id) {
    const attachment = await this.getAttachment({ _id: id });
    if (attachment) {
      await this.Attachment.deleteOne({ _id: id });
      await this.fileManager.deleteFile(attachment.fileMetaInfo);
      return attachment;
    }
  }
}

module.exports = { Attachment };
