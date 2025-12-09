const { IamPolicy } = require("../services/iamPolicy");
const { RiskManagementService } = require("../services/riskManagement");
const { Filters } = require("../services/utility");
const { StatusCodes } = require("http-status-codes");
const FileHandlerService = require("../services/fileHandler");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");
exports.createRisk = async (req, res, next) => {
  let riskManager = new RiskManagementService(req.accessControl);
  try {
    let risk = await riskManager.createRisk({
      ...req.body,
      organization: req.accessControl.user.organizationId,
      createdBy: req.accessControl.user,
    });
    res
      .status(StatusCodes.OK)
      .json({ message: "Risk has been created.", risk });
  } catch (err) {
    next(err);
  }
};
exports.editRisk = async (req, res, next) => {
  let riskManager = new RiskManagementService(req.accessControl);
  try {
    let { id } = req.params;
    let risk = await riskManager.updateRisk(id, {
      ...req.body,
      updatedBy: req.accessControl.user,
    });
    res.status(StatusCodes.OK).json({ message: "Risk update success", risk });
  } catch (err) {
    next(err);
  }
};
exports.deleteRisk = async (req, res, next) => {
  let riskManager = new RiskManagementService(req.accessControl);
  try {
    let risk = await riskManager.deleteRisk({ _id: req.params.id });
    res.status(StatusCodes.OK).json({ message: "Risk has been deleted", risk });
  } catch (err) {
    next(err);
  }
};
exports.mitigateRisk = async (req, res, next) => {
  let riskManager = new RiskManagementService(req.accessControl);
  try {
    let { id } = req.params;
    let risk = await riskManager.mitigateRisk(id, {
      ...req.body,
      mitigatedBy: req.accessControl.user,
    });
    res
      .status(StatusCodes.OK)
      .json({ message: "Risk has been mitigated.", risk });
  } catch (err) {
    next(err);
  }
};
exports.acceptRisk = async (req, res, next) => {
  let riskManager = new RiskManagementService(req.accessControl);
  try {
    let { id } = req.params;
    let risk = await riskManager.acceptRisk(id, {
      ...req.body,
      updatedBy: req.accessControl.user,
    });
    res
      .status(StatusCodes.OK)
      .json({ message: "Risk has beed accepted.", risk });
  } catch (err) {
    next(err);
  }
};
exports.escalateRisk = async (req, res, next) => {
  let riskManager = new RiskManagementService(req.accessControl);
  try {
    let { id } = req.params;
    let risk = await riskManager.escalateRisk(id, {
      updatedBy: req.accessControl.user,
    });
    res
      .status(StatusCodes.OK)
      .json({ message: "Risk has been escalated", risk });
  } catch (err) {
    next(err);
  }
};
exports.getRisk = async (req, res, next) => {
  let riskManager = new RiskManagementService(req.accessControl);
  try {
    let { id } = req.params;
    let risk = await riskManager.getRisk({ _id: id });
    res
      .status(StatusCodes.OK)
      .json({ message: "Risk retrival successful", risk });
  } catch (err) {
    next(err);
  }
};
exports.getRisks = async (req, res, next) => {
  let riskManager = new RiskManagementService(req.accessControl);
  try {
    let { page, sort, size } = req.query;
    let { groupPolicy, session } = req.accessControl;
    const options = { page, limit: size, sort };
    let filter = new Filters(req, {
      searchFields: ["reference", "title", "description"],
    })
      .build()
      .query();
    let query = { ...filter };
    // let iamPolicy = new IamPolicy(req.accessControl);
    // if (!iamPolicy.validateGlobalAccess(groupPolicy))
    //   query = { ...query, group: session.current.group };
    const result = await riskManager.listRisksByOrg(query, options);
    res.status(StatusCodes.OK).json({
      message: "Risks retrival success",
      pagination: result.pagination,
      risks: result.risks,
    });
  } catch (err) {
    next(err);
  }
};
exports.deleteAttachment = async (req, res, next) => {
  let riskManager = new RiskManagementService(req.accessControl);
  let { id, attachment_id } = req.params;
  try {
    let risk = await riskManager.deleteAttachment(id, attachment_id);
    return res
      .status(StatusCodes.OK)
      .json({ message: "Risk attachment deleted successfully.", risk });
  } catch (err) {
    next(err);
  }
};
exports.getRisksReport = async (req, res, next) => {
  let riskManager = new RiskManagementService(req.accessControl);
  let fileHandlerService = new FileHandlerService(req.accessControl);
  try {
    let { type } = req.query;
    let { groupPolicy, session } = req.accessControl;
    let iamPolicy = new IamPolicy(req.accessControl);
    let query = {};
    if (iamPolicy.validateGlobalAccess(groupPolicy)) {
      query = { ...query, type };
    } else {
      query = { ...query, group: session.current.group, type };
    }
    let csvresponse = await riskManager.riskSheet(query);
    res.status(200).sendFile(csvresponse.file);
    res.on("finish", function () {
      fileHandlerService.removeTemporary(csvresponse);
    });
  } catch (err) {
    next(err);
  }
};
exports.linkISOControls = async (req, res, next) => {
  let riskManager = new RiskManagementService(req.accessControl);
  let { id } = req.params;
  try {
    let risk = await riskManager.linkISOControls(id, {
      ...req.body,
      user: req.accessControl.user,
    });
    return res
      .status(StatusCodes.OK)
      .json({ message: "Control addded successfully.", risk });
  } catch (err) {
    next(err);
  }
};
exports.removeISOControls = async (req, res, next) => {
  let riskManager = new RiskManagementService(req.accessControl);
  let { id } = req.params;
  try {
    let risk = await riskManager.removeISOControls(id, {
      ...req.body,
      user: req.accessControl.user,
    });
    return res
      .status(StatusCodes.OK)
      .json({ message: "Control removed successfully.", risk });
  } catch (err) {
    next(err);
  }
};
exports.seedData = async (req, res, next) => {
  try {
    logger.info("Start seeding data...");
    res.status(StatusCodes.OK).json({ messageL: "Data seed success full" });
  } catch (err) {
    next(err);
  }
};
