const { Manager } = require("../manager");
const { APIError } = require("../../../helpers/errors/apiError");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const mongoose = require("mongoose");

class FullReport extends Manager {
  constructor(connection) {
    super(connection);
  }
  async runAnalysis() {
    return {};
  }
}

module.exports = { FullReport };
