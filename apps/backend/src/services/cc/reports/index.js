const { Manager } = require("../manager");
const { APIError } = require("../../../helpers/errors/apiError");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const mongoose = require("mongoose");
const { BaseYearCompareReport } = require("./baseYearCompareReport");
const { SingleYearReport } = require("./singleYearReport");
const { ScopeOneAndTwoReport } = require("./scopeOneAndTwoReport");
const { HistoricTrendsReport } = require("./historicTrendsReport");
const { ActivitySummaryReport } = require("./activitySummaryReport");
const { GHGStatementReport } = require("./ghgStatementReport");
const { FullReport } = require("./fullReport");
const { imsPaginationFormated } = require("../../utility");
const { SecrReport } = require("./secrReport");

class CcReports extends Manager {
  constructor(connection) {
    super(connection);
    this.dashboard = new SingleYearReport(connection);
    this.singleYearReport = new SingleYearReport(connection);
    this.baseYearCompareReport = new BaseYearCompareReport(connection);
    this.scopeOneAndTwoReport = new ScopeOneAndTwoReport(connection);
    this.historicTrendsReport = new HistoricTrendsReport(connection);
    this.activitySummaryReport = new ActivitySummaryReport(connection);
    this.ghgStatementReport = new GHGStatementReport(connection);
    this.imsPaginationFormated = imsPaginationFormated;
    this.fullReport = new FullReport(connection);
    this.secrReport = new SecrReport(connection);
  }
  async listCcReports(query, options) {
    let pagination = await this.CcReports.paginateByOrg(
      this.connection.user.organizationId,
      query,
      options
    );
    let reports = pagination.docs;
    return { reports, pagination: this.imsPaginationFormated(pagination) };
  }
}

module.exports = { CcReports };
