const attachment = require("../../services/attachment");
const { StatusCodes } = require("http-status-codes");
const { Filters, formatListResponse } = require("../../services/utility");

exports.createAttachment = async (req, res, next) => {
  let attachmentService = new attachment.Attachment(req.accessControl);
  try {
    const attachment = await attachmentService.createAttachment({
      ...req.body,
      organization: req.accessControl?.user?.organizationId,
    });
    console.log("attachment is ", attachment?.fileMetaInfo?.Name);
    return res.status(StatusCodes.OK).json({
      message: `${attachment?.fileMetaInfo?.Name} added successfully.`,
      attachment,
    });
  } catch (error) {
    next(error);
  }
};

exports.getAttachment = async (req, res, next) => {
  let attachmentService = new attachment.Attachment(req.accessControl);
  try {
    const { id } = req.params;
    const attachment = await attachmentService.getAttachment({ _id: id });
    res.status(StatusCodes.OK).json({
      message: "attachment retrived.",
      attachment,
    });
  } catch (error) {
    next(error);
  }
};

exports.listAttachment = async (req, res, next) => {
  let attachmentService = new attachment.Attachment(req.accessControl);
  try {
    let { page, sort, size } = req.query;
    const options = { page, limit: size, sort };
    let filter = new Filters(req, {
      searchFields: [],
    })
      .build()
      .query();
    let query = { ...filter };
    const results = await attachmentService.listAttachment(query, options);
    return res.status(StatusCodes.OK).json({
      message: "Attachment retrived.",
      attachments: formatListResponse(results).data,
      pagination: formatListResponse(results).pagination,
    });
  } catch (error) {
    next(error);
  }
};

exports.softRemoveAttachment = async (req, res, next) => {
  let attachmentService = new attachment.Attachment(req.accessControl);
  try {
    const attachment = await attachmentService.softRemoveAttachment(
      req.params.id
    );
    return res.status(StatusCodes.OK).json({
      message: "Attachment moved to trash.",
      attachment,
    });
  } catch (error) {
    next(error);
  }
};

exports.restoreAttachment = async (req, res, next) => {
  let attachmentService = new attachment.Attachment(req.accessControl);
  try {
    const attachment = await attachmentService.restoreAttachment(req.params.id);
    return res.status(StatusCodes.OK).json({
      message: "Attachment restored.",
      attachment,
    });
  } catch (error) {
    next(error);
  }
};

exports.hardRemoveAttachment = async (req, res, next) => {
  let attachmentService = new attachment.Attachment(req.accessControl);
  try {
    const attachment = await attachmentService.hardRemoveAttachment(
      req.params.id
    );
    return res.status(StatusCodes.OK).json({
      message: "Attachment removed.",
      attachment,
    });
  } catch (error) {
    next(error);
  }
};
