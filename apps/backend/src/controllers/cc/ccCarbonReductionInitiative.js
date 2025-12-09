const cc = require("../../services/cc");
const { StatusCodes } = require("http-status-codes");
const { Filters, formatListResponse } = require("../../services/utility");

exports.createCcCarbonReductionInitiative = async (req, res, next) => {
  let ccCarbonReductionInitiativeService = new cc.CcCarbonReductionInitiative(req.accessControl);
  try {
    const ccCarbonReductionInitiative = await ccCarbonReductionInitiativeService.createCcCarbonReductionInitiative({
      ...req.body,
      createdBy: req.accessControl?.user?._id,
      organization: req.accessControl?.user?.organizationId,
    });
    return res.status(StatusCodes.OK).json({
      message: "carbon reduction initiative created successfully.",
      ccCarbonReductionInitiative,
    });
  } catch (error) {
    next(error);
  }
};

exports.getCcCarbonReductionInitiative = async (req, res, next) => {
  let ccCarbonReductionInitiativeService = new cc.CcCarbonReductionInitiative(req.accessControl);
  try {
    const { id } = req.params;
    const ccCarbonReductionInitiative = await ccCarbonReductionInitiativeService.getCcCarbonReductionInitiative({
      _id: id,
    });
    res.status(StatusCodes.OK).json({
      message: "carbon reduction initiative retrived.",
      ccCarbonReductionInitiative,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateCcCarbonReductionInitiative = async (req, res, next) => {
  let ccCarbonReductionInitiativeService = new cc.CcCarbonReductionInitiative(req.accessControl);
  try {
    const { id } = req.params;
    const ccCarbonReductionInitiative = await ccCarbonReductionInitiativeService.updateCcCarbonReductionInitiative(
      id,
      req.body
    );
    res.status(StatusCodes.OK).json({
      message: "carbon reduction initiative info updated.",
      ccCarbonReductionInitiative,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateCcCarbonReductionInitiativeAttachments = async (req, res, next) => {
  let ccCarbonReductionInitiativeService = new cc.CcCarbonReductionInitiative(req.accessControl);
  try {
    const { id } = req.params;
    const ccCarbonReductionInitiative = await ccCarbonReductionInitiativeService.updateCcCarbonReductionInitiativeAttachments(
      id,
      req.body
    );
    res.status(StatusCodes.OK).json({
      message: "carbon reduction initiative attachments updated.",
      ccCarbonReductionInitiative,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateCcCarbonReductionInitiativeAssignedUsers = async (req, res, next) => {
  let ccCarbonReductionInitiativeService = new cc.CcCarbonReductionInitiative(req.accessControl);
  try {
    const { id } = req.params;
    const ccCarbonReductionInitiative = await ccCarbonReductionInitiativeService.updateCcCarbonReductionInitiativeAssignedUsers(
      id,
      req.body
    );
    res.status(StatusCodes.OK).json({
      message: "carbon reduction initiative assigned user info updated.",
      ccCarbonReductionInitiative,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteCcCarbonReductionInitiativeAttachment = async (req, res, next) => {
  let ccCarbonReductionInitiativeService = new cc.CcCarbonReductionInitiative(req.accessControl);
  try {
    const { initiativeId, attachmentId } = req.params;
    const ccCarbonReductionInitiative = await ccCarbonReductionInitiativeService.deleteCcCarbonReductionInitiativeAttachments(
      initiativeId,
      attachmentId
    );
    res.status(StatusCodes.OK).json({
      message: "carbon reduction initiative attachment removed.",
      ccCarbonReductionInitiative,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteCcCarbonReductionInitiativeAssignedUser = async (req, res, next) => {
  let ccCarbonReductionInitiativeService = new cc.CcCarbonReductionInitiative(req.accessControl);
  try {
    const { initiativeId, userId } = req.params;
    const ccCarbonReductionInitiative = await ccCarbonReductionInitiativeService.deleteCcCarbonReductionInitiativeAssignedUser(
      initiativeId,
      userId
    );
    res.status(StatusCodes.OK).json({
      message: "carbon reduction initiative assigned user removed.",
      ccCarbonReductionInitiative,
    });
  } catch (error) {
    next(error);
  }
};

exports.listCcCarbonReductionInitiative = async (req, res, next) => {
  let ccCarbonReductionInitiativeService = new cc.CcCarbonReductionInitiative(req.accessControl);
  try {
    let { page, sort, size } = req.query;
    const options = { page, limit: size, sort };
    let filter = new Filters(req, {
      searchFields: ["title", "reference"],
    })
      .build()
      .query();
    let query = { ...filter };
    const results = await ccCarbonReductionInitiativeService.listCcCarbonReductionInitiative(
      query,
      options
    );
    return res.status(StatusCodes.OK).json({
      message: "carbon reduction initiative retrived.",
      pagination: formatListResponse(results).pagination,
      ccCarbonReductionInitiatives: formatListResponse(results).data,
    });
  } catch (error) {
    next(error);
  }
};

exports.softRemoveCcCarbonReductionInitiative = async (req, res, next) => {
  let ccCarbonReductionInitiativeService = new cc.CcCarbonReductionInitiative(req.accessControl);
  try {
    const ccCarbonReductionInitiative = await ccCarbonReductionInitiativeService.softRemoveCcCarbonReductionInitiative(
      req.params.id
    );
    return res.status(StatusCodes.OK).json({
      message: "carbon reduction initiative moved to trash.",
      ccCarbonReductionInitiative,
    });
  } catch (error) {
    next(error);
  }
};

exports.restoreCcCarbonReductionInitiative = async (req, res, next) => {
  let ccCarbonReductionInitiativeService = new cc.CcCarbonReductionInitiative(req.accessControl);
  try {
    const ccCarbonReductionInitiative = await ccCarbonReductionInitiativeService.restoreCcCarbonReductionInitiative(
      req.params.id
    );
    return res.status(StatusCodes.OK).json({
      message: "carbon reduction initiative restored.",
      ccCarbonReductionInitiative,
    });
  } catch (error) {
    next(error);
  }
};

exports.hardRemoveCcCarbonReductionInitiative = async (req, res, next) => {
  let ccCarbonReductionInitiativeService = new cc.CcCarbonReductionInitiative(req.accessControl);
  try {
    const ccCarbonReductionInitiative = await ccCarbonReductionInitiativeService.hardRemoveCcCarbonReductionInitiative(
      req.params.id
    );
    return res.status(StatusCodes.OK).json({
      message: "carbon reduction initiative removed.",
      ccCarbonReductionInitiative,
    });
  } catch (error) {
    next(error);
  }
};
