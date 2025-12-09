const { Manager } = require("../manager");
const { APIError } = require("../../../helpers/errors/apiError");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const mongoose = require("mongoose");

class ActivitySummaryReport extends Manager {
  constructor(connection) {
    super(connection);
  }
  async getReport(query, options) {
    const activityAggregate = this.CcCalculation.aggregate()
      .match({
        organization: new mongoose.Types.ObjectId(
          this.connection.user.organizationId
        ),
        reportingYear: Number(query?.reportingYear) || null,
        category: query?.category?.trim() || null,
      })
      .group({
        _id: {
          activity: "$activity",
          unit: "$unit",
        },
        totalCO2eEmissions: {
          $sum: "$ghgCo2eEmission",
        },
        totalEmmisionFactorKgCo2ePerUnit: {
          $sum: "$emmisionFactorKgCo2ePerUnit",
        },
        amount: {
          $sum: "$amount",
        },
        emissionFactorSource: {
          $first: "$emissionFactorSource",
        },
        emmisionFactorNote: {
          $first: "$emmisionFactorNote",
        },
      });
    const pagination = await this.CcCalculation.aggregatePaginate(
      activityAggregate,
      options
    );
    return {
      activitySummary: pagination.docs,
      pagination: this.imsPaginationFormated(pagination),
    };
  }
}

module.exports = { ActivitySummaryReport };
