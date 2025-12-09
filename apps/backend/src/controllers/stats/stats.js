const { StatsService } = require("../../services/stats");
const { StatusCodes } = require("http-status-codes");
const { Filters, formatListResponse } = require("../../services/utility");

exports.globalStats = async (req, res, next) => {
  try {
    const statsService = new StatsService(req.accessControl);
    const { startDate, endDate } = req.query;
    const stats = await statsService.globalStats({ startDate, endDate });
    return res.status(StatusCodes.OK).json({
      message: "Global stats retrieved successfully.",
      stats,
    });
  } catch (error) {
    next(error);
  }
};

exports.digitalMaturityStats = async (req, res, next) => {
  try {
    const statsService = new StatsService(req.accessControl);
    const { startDate, endDate } = req.query;
    const stats = await statsService.digitalMaturityStats({
      startDate,
      endDate,
    });
    return res.status(StatusCodes.OK).json({
      message: "Digital maturity stats retrieved successfully.",
      stats,
      statusCode: StatusCodes.OK,
    });
  } catch (error) {
    next(error);
  }
};

exports.incidentStats = async (req, res, next) => {
  try {
    const statsService = new StatsService(req.accessControl);
    const { startDate, endDate } = req.query;
    const stats = await statsService.incidentStats({ startDate, endDate });
    return res.status(StatusCodes.OK).json({
      message: "Incident stats retrieved successfully.",
      stats,
    });
  } catch (error) {
    next(error);
  }
};

exports.complianceStats = async (req, res, next) => {
  try {
    const statsService = new StatsService(req.accessControl);
    const { startDate, endDate } = req.query;
    const stats = await statsService.complianceStats({ startDate, endDate });
    return res.status(StatusCodes.OK).json({
      message: "Compliance stats retrieved successfully.",
      stats,
    });
  } catch (error) {
    next(error);
  }
};

exports.auditStats = async (req, res, next) => {
  try {
    const statsService = new StatsService(req.accessControl);
    const { startDate, endDate } = req.query;
    const stats = await statsService.auditStats({ startDate, endDate });
    return res.status(StatusCodes.OK).json({
      message: "Audit stats retrieved successfully.",
      stats,
    });
  } catch (error) {
    next(error);
  }
};

exports.riskStats = async (req, res, next) => {
  try {
    const statsService = new StatsService(req.accessControl);
    const { months } = req.query;
    const stats = await statsService.riskStats({ months });
    return res.status(StatusCodes.OK).json({
      message: "Risk stats retrieved successfully.",
      stats,
    });
  } catch (error) {
    next(error);
  }
};

exports.inventoryStats = async (req, res, next) => {
  try {
    const statsService = new StatsService(req.accessControl);
    const { startDate, endDate } = req.query;
    const stats = await statsService.inventoryStats({ startDate, endDate });
    return res.status(StatusCodes.OK).json({
      message: "Inventory stats retrieved successfully.",
      stats,
    });
  } catch (error) {
    next(error);
  }
};

exports.supplierStats = async (req, res, next) => {
  try {
    const statsService = new StatsService(req.accessControl);
    const { startDate, endDate } = req.query;
    const stats = await statsService.supplierStats({ startDate, endDate });
    return res.status(StatusCodes.OK).json({
      message: "Supplier stats retrieved successfully.",
      stats,
    });
  } catch (error) {
    next(error);
  }
};

exports.cipStats = async (req, res, next) => {
  try {
    const statsService = new StatsService(req.accessControl);
    const { startDate, endDate } = req.query;
    const stats = await statsService.cipStats({ startDate, endDate });
    return res.status(StatusCodes.OK).json({
      message: "CIP stats retrieved successfully.",
      stats,
    });
  } catch (error) {
    next(error);
  }
};

exports.crmStats = async (req, res, next) => {
  try {
    const statsService = new StatsService(req.accessControl);
    const { startDate, endDate } = req.query;
    const stats = await statsService.crmStats({ startDate, endDate });
    return res.status(StatusCodes.OK).json({
      message: "CRM stats retrieved successfully.",
      stats,
    });
  } catch (error) {
    next(error);
  }
};
