const imsProject = require("../../services/imsProjects");
const { StatusCodes } = require("http-status-codes");
const { Filters, formatListResponse } = require("../../services/utility");
const mongoose = require("mongoose");

exports.createImsProjectBudget = async (req, res, next) => {
  let imsProjectBudgetService = new imsProject.ImsProjectBudget(
    req.accessControl
  );
  try {
    const { projectId } = req.params;
    const imsProjectBudget =
      await imsProjectBudgetService.createImsProjectBudget({
        ...req.body,
        imsProjectId: projectId,
        organization: req.accessControl?.user?.organizationId,
      });
    return res.status(StatusCodes.OK).json({
      message: "Spend added successfully.",
      imsProjectBudget,
    });
  } catch (error) {
    next(error);
  }
};

exports.getImsProjectBudget = async (req, res, next) => {
  let imsProjectBudgetService = new imsProject.ImsProjectBudget(
    req.accessControl
  );
  try {
    const { id, projectId } = req.params;
    const imsProjectBudget = await imsProjectBudgetService.getImsProjectBudget({
      _id: id,
      imsProjectId: projectId,
    });
    res.status(StatusCodes.OK).json({
      message: "Spend retrived.",
      imsProjectBudget,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateImsProjectBudget = async (req, res, next) => {
  let imsProjectBudgetService = new imsProject.ImsProjectBudget(
    req.accessControl
  );
  try {
    const { projectId, id } = req.params;
    const imsProjectBudget =
      await imsProjectBudgetService.updateImsProjectBudget(id, {
        ...req.body,
        projectId: projectId,
      });
    res.status(StatusCodes.OK).json({
      message: "Spend updated.",
      imsProjectBudget,
    });
  } catch (error) {
    next(error);
  }
};

exports.listImsProjectBudget = async (req, res, next) => {
  let imsProjectBudgetService = new imsProject.ImsProjectBudget(
    req.accessControl
  );
  try {
    let { page, sort, size } = req.query;
    const options = { page, limit: size, sort };
    let filter = new Filters(req, {
      searchFields: [],
    })
      .build()
      .query();
    let query = {
      ...filter,
      imsProjectId: new mongoose.Types.ObjectId(req.params.projectId),
    };
    const results = await imsProjectBudgetService.listImsProjectBudget(
      query,
      options
    );
    return res.status(StatusCodes.OK).json({
      message: "Spends retrived.",
      pagination: formatListResponse(results).pagination,
      imsProjectBudgets: formatListResponse(results).data,
    });
  } catch (error) {
    next(error);
  }
};

exports.softRemoveImsProjectBudget = async (req, res, next) => {
  let imsProjectBudgetService = new imsProject.ImsProjectBudget(
    req.accessControl
  );
  try {
    const imsProjectBudget =
      await imsProjectBudgetService.softRemoveImsProjectBudget(req.params.id);
    return res.status(StatusCodes.OK).json({
      message: "Spend moved to trash.",
      imsProjectBudget,
    });
  } catch (error) {
    next(error);
  }
};

exports.restoreImsProjectBudget = async (req, res, next) => {
  let imsProjectBudgetService = new imsProject.ImsProjectBudget(
    req.accessControl
  );
  try {
    const imsProjectBudget =
      await imsProjectBudgetService.restoreImsProjectBudget(req.params.id);
    return res.status(StatusCodes.OK).json({
      message: "Spend restored.",
      imsProjectBudget,
    });
  } catch (error) {
    next(error);
  }
};

exports.hardRemoveImsProjectBudget = async (req, res, next) => {
  let imsProjectBudgetService = new imsProject.ImsProjectBudget(
    req.accessControl
  );
  try {
    const imsProjectBudget =
      await imsProjectBudgetService.hardRemoveImsProjectBudget(req.params.id);
    return res.status(StatusCodes.OK).json({
      message: "Spend removed.",
      imsProjectBudget,
    });
  } catch (error) {
    next(error);
  }
};
