const { Filters } = require("../services/utility");
const { trimQuery } = require("../validations/utils");
const { IamPolicy } = require("../services/iamPolicy");
const cipService = require("../services/cip");
const { StatusCodes } = require("http-status-codes");
// route '/:organizationId/:group
exports.createCip = async (req, res, next) => {
  let cipCrudOps = new cipService.CipCRUDOperations(req.accessControl);
  try {
    let cip = await cipCrudOps.createCip({
      ...req.body,
      organization: req.accessControl.user.organizationId,
      createdBy: req.accessControl.user,
    });
    res.status(StatusCodes.OK).json({ message: "OFI created.", cip });
  } catch (err) {
    next(err);
  }
};
exports.getCips = async (req, res, next) => {
  let cipCrudOps = new cipService.CipCRUDOperations(req.accessControl);
  try {
    let { groupPolicy, session } = req.accessControl;
    let { page, sort, size } = trimQuery(req.query);
    let cips = [];
    const options = { page: parseInt(page), limit: parseInt(size), sort };
    let filters = new Filters(req, {
      searchFields: ["reference", "title", "opportunityForImprovement"],
    })
      .build()
      .query();
    let query = { ...filters };
    // let iamPolicy = new IamPolicy(req.accessControl);
    // if (!iamPolicy.validateGlobalAccess(groupPolicy))
    //   query = { ...query, group: session.current.group };
    const results = await cipCrudOps.listCipsByOrg(query, options);
    res.status(200).json({
      message: "OFIs retrived.",
      pagination: results.pagination,
      cips: results.cips,
    });
  } catch (err) {
    next(err);
  }
};
exports.getCip = async (req, res, next) => {
  let cipCrudOps = new cipService.CipCRUDOperations(req.accessControl);
  try {
    let { id } = req.params;
    let cip = await cipCrudOps.getCip({ _id: id });
    res.status(StatusCodes.OK).json({ message: "OFI retrived.", cip });
  } catch (err) {
    next(err);
  }
};
exports.editCip = async (req, res, next) => {
  let cipCrudOps = new cipService.CipCRUDOperations(req.accessControl);
  try {
    let { id } = req.params;
    let cip = await cipCrudOps.updateCip(id, {
      ...req.body,
      updatedBy: req.accessControl.user,
    });
    res.status(StatusCodes.OK).json({ message: "OFI updated.", cip });
  } catch (err) {
    next(err);
  }
};
exports.removeCip = async (req, res, next) => {
  let cipCrudOps = new cipService.CipCRUDOperations(req.accessControl);
  try {
    let { id } = req.params;
    let cip = await cipCrudOps.deleteCip(id);
    res.status(StatusCodes.OK).json({ message: "OFI deleted.", cip });
  } catch (err) {
    next(err);
  }
};
exports.deleteAttachment = async (req, res, next) => {
  let cipCrudOps = new cipService.CipCRUDOperations(req.accessControl);
  try {
    let { id, attachment_id } = req.params;
    let cip = await cipCrudOps.deleteAttachment(id, { attachment_id });
    return res
      .status(StatusCodes.OK)
      .json({ message: "OFI attachment has been deleted.", cip });
  } catch (err) {
    next(err);
  }
};
exports.implementCip = async (req, res, next) => {
  let cipLifecycle = new cipService.Lifecycle(req.accessControl);
  try {
    let { id } = req.params;
    let cip = await cipLifecycle.markCipAsImplemented(id, {
      implementedBy: req.accessControl.user,
    });
    res
      .status(StatusCodes.OK)
      .json({ message: "OFI implemented successfully.", cip });
  } catch (err) {
    next(err);
  }
};
exports.linkISOControls = async (req, res, next) => {
  let cipcompliance = new cipService.ComplianceManager(req.accessControl);
  let { id } = req.params;
  try {
    let cip = await cipcompliance.linkISOControls(id, {
      ...req.body,
      user: req.accessControl.user,
    });
    return res
      .status(StatusCodes.OK)
      .json({ message: "Control addded successfully.", cip });
  } catch (err) {
    next(err);
  }
};
exports.removeISOControls = async (req, res, next) => {
  let cipcompliance = new cipService.ComplianceManager(req.accessControl);
  let { id } = req.params;
  try {
    let cip = await cipcompliance.removeISOControls(id, {
      ...req.body,
      user: req.accessControl.user,
    });
    return res
      .status(StatusCodes.OK)
      .json({ message: "Control removed successfully.", cip });
  } catch (err) {
    next(err);
  }
};
