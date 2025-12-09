const cc = require("../../services/cc");
const { StatusCodes } = require("http-status-codes");
const { Filters, formatListResponse } = require("../../services/utility");
const { trimQuery } = require("../../validations/utils");

exports.getCcSingleYearReport = async (req, res, next) => {
  let ccReportsService = new cc.CcReports(req.accessControl);
  try {
    const report = await ccReportsService.singleYearReport.getReport({
      ...req.query,
    });
    return res.status(StatusCodes.OK).json({
      message: "Single year report retrived.",
      singleYearReport: report.singleYearReport,
      baseYearReport: report.baseYearReport,
    });
  } catch (error) {
    next(error);
  }
};

exports.getBaseYearCompareReport = async (req, res, next) => {
  let ccReportsService = new cc.CcReports(req.accessControl);
  try {
    const baseYearCompareReport =
      await ccReportsService.baseYearCompareReport.getReport({
        ...req.query,
      });
    return res.status(StatusCodes.OK).json({
      message: "Base year report retrived.",
      baseYearCompareReport,
    });
  } catch (error) {
    next(error);
  }
};

exports.getScopeOneAndTwoReport = async (req, res, next) => {
  let ccReportsService = new cc.CcReports(req.accessControl);
  try {
    const scopeOneAndTwoReport =
      await ccReportsService.scopeOneAndTwoReport.getReport({
        ...req.query,
      });
    return res.status(StatusCodes.OK).json({
      message: "Scope one and two report retrived.",
      scopeOneAndTwoReport,
    });
  } catch (error) {
    next(error);
  }
};

exports.getHistoricTrendsReport = async (req, res, next) => {
  let ccReportsService = new cc.CcReports(req.accessControl);
  try {
    const historicTrendsReport =
      await ccReportsService.historicTrendsReport.getReport({
        ...req.query,
      });
    return res.status(StatusCodes.OK).json({
      message: "Historic trends report retrived.",
      historicTrendsReport,
    });
  } catch (error) {
    next(error);
  }
};

exports.getActivitySummaryReport = async (req, res, next) => {
  let ccReportsService = new cc.CcReports(req.accessControl);
  try {
    const activitySummaryReport =
      await ccReportsService.activitySummaryReport.getReport({
        ...req.query,
      });
    return res.status(StatusCodes.OK).json({
      message: "Activity summary report retrived.",
      activitySummary: activitySummaryReport.activitySummary,
      pagination: activitySummaryReport.pagination,
    });
  } catch (error) {
    next(error);
  }
};

exports.getGHGStatementReport = async (req, res, next) => {
  let ccReportsService = new cc.CcReports(req.accessControl);
  try {
    const ghgStatementReport =
      await ccReportsService.ghgStatementReport.getReport({
        ...req.query,
      });
    return res.status(StatusCodes.OK).json({
      message: "GHG statement report retrived.",
      ghgStatementReport,
    });
  } catch (error) {
    next(error);
  }
};
exports.getFullReport = async (req, res, next) => {
  let ccReportsService = new cc.CcReports(req.accessControl);
  try {
    const fullReport = await ccReportsService.fullReport.getReport({
      ...req.query,
    });
    return res.status(StatusCodes.OK).json({
      message: "Full report retrived.",
      fullReport,
    });
  } catch (error) {
    next(error);
  }
};
exports.listCcReports = async (req, res, next) => {
  let ccReportsService = new cc.CcReports(req.accessControl);
  try {
    let { type, page, sort, size } = trimQuery(req.query);
    const options = {
      page: parseInt(page),
      limit: parseInt(size),
      sort: { year: 1 },
      sort,
    };
    let filter = new Filters(req, {
      searchFields: [],
    })
      .build()
      .query();
    let query = { type, ...filter };
    const results = await ccReportsService.listCcReports(query, options);
    return res.status(StatusCodes.OK).json({
      message: "Reports retrived",
      pagination: results.pagination,
      reports: results.reports,
    });
  } catch (error) {
    next(error);
  }
};

exports.getCcReport = async (req, res, next) => {
  try {
    return res.status(StatusCodes.OK).json({
      message: "cc report retrived.",
    });
  } catch (error) {
    next(error);
  }
};

exports.getSecrReport = async (req, res, next) => {
  let ccReportsService = new cc.CcReports(req.accessControl);
  try {
    const secrReport = await ccReportsService.secrReport.getReport(req.query);
    return res.status(StatusCodes.OK).json({
      message: "SECR report retrieved.",
      secrReport,
    });
  } catch (error) {
    next(error);
  }
};
