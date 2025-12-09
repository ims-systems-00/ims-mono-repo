const { Manager } = require("../manager");
const { APIError } = require("../../../helpers/errors/apiError");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const mongoose = require("mongoose");

class BaseYearCompareReport extends Manager {
  constructor(connection) {
    super(connection);
  }
  async runAnalysis() {
    return {};
  }
  async getReport(query) {
    let report = await this.runAnalysis(Number(query?.reportingYear));
    return report;
  }
}

module.exports = { BaseYearCompareReport };
