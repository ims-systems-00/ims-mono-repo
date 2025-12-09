const { StatusCodes } = require("http-status-codes");
const KpiObjectiveModel = require("../models/mongodb/system/managementReview/kpiObjective");
const { IamPolicy } = require("../services/iamPolicy");
const kpiObjectiveService = require("../services/managementReview/kpiObjective");
const { Filters } = require("../services/utility");
const { trimQuery } = require("../validations/utils");
exports.addKpiObjective = async (req, res, next) => {
  let kpiObjectiveManager = new kpiObjectiveService(req.accessControl);
  try {
    let kpiObjective = await kpiObjectiveManager.addKpiObjective({
      ...req.body,
      organization: req.accessControl.user.organizationId,
      createdBy: req.accessControl.user,
    });
    res
      .status(StatusCodes.OK)
      .json({ message: "KPI metric successfully added.", kpiObjective });
  } catch (err) {
    next(err);
  }
};
exports.updateKpiObjective = async (req, res, next) => {
  let kpiObjectiveManager = new kpiObjectiveService(req.accessControl);
  try {
    let { id } = req.params;
    let kpiObjective = await kpiObjectiveManager.updateKpiObjective(
      id,
      req.body
    );
    res
      .status(200)
      .json({ message: "KPI metric successfully updated.", kpiObjective });
  } catch (err) {
    next(err);
  }
};
exports.getKpiObjectives = async (req, res, next) => {
  let kpiObjectiveManager = new kpiObjectiveService(req.accessControl);
  try {
    let { page, sort, size } = trimQuery(req.query);
    const options = { page, limit: size, sort };
    let filter = new Filters(req, { searchFields: ["reference", "title"] })
      .build()
      .query();
    let query = { ...filter };
    let results = await kpiObjectiveManager.listKpiObjectivesByOrg(
      query,
      options
    );
    res.status(StatusCodes.OK).json({
      message: "KPI metrics successfully retrived.",
      pagination: results.pagination,
      kpiObjectives: results.kpiObjectives,
    });
  } catch (err) {
    next(err);
  }
};
exports.getKpiObjective = async (req, res, next) => {
  let kpiObjectiveManager = new kpiObjectiveService(req.accessControl);
  try {
    let { id } = req.params;
    let kpiObjective = await kpiObjectiveManager.getKpiObjective(id);
    res
      .status(200)
      .json({ message: "KPI metric successfully retrived.", kpiObjective });
  } catch (err) {
    next(err);
  }
};
exports.removeKpiObjective = async (req, res, next) => {
  let kpiObjectiveManager = new kpiObjectiveService(req.accessControl);
  try {
    let { id } = req.params;
    let kpiObjective = await kpiObjectiveManager.removeKpiObjective(id);
    res
      .status(200)
      .json({ message: "KPI metric successfully deleted", kpiObjective });
  } catch (err) {
    next(err);
  }
};
