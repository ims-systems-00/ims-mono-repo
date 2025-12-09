const { Manager } = require("../manager");
const { APIError } = require("../../../helpers/errors/apiError");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const mongoose = require("mongoose");
const {
  CC_DEFAULT_REPORTS,
  CC_EMISSION_SCOPES,
} = require("../../../models/mongodb/system/cc/ccEnum");

class HistoricTrendsReport extends Manager {
  constructor(connection) {
    super(connection);
  }
  async runAnalysis(parameter) {
    if (!parameter) {
      parameter = await this.CcParameter.findOne({
        organization: this.connection.user.organizationId,
      });
      if (!parameter)
        throw new APIError(
          ReasonPhrases.NOT_FOUND,
          StatusCodes.NOT_FOUND,
          "Please configure parameters to get a single year report."
        );
    }
    let startDateConfig = new Date(parameter?.reportingStartDate);
    let endDateConfig = new Date();

    const startingYear = startDateConfig.getFullYear();
    const endingYear = endDateConfig.getFullYear();

    // categorical calculation
    const scopeBasedCategoryEmissionPipelines = Object.values(
      CC_EMISSION_SCOPES
    ).map((scope) => {
      const reportsAggregationPipeline = this.CcReports.aggregate();
      return reportsAggregationPipeline
        .match({
          organization: new mongoose.Types.ObjectId(
            this.connection.user.organizationId
          ),
          year: { $gte: startingYear, $lte: endingYear },
          name: CC_DEFAULT_REPORTS.SINGLE_YEAR_REPORT,
        })
        .group({
          _id: { year: "$year", scope },
          [scope]: {
            $push: `$content.scopeBasedEmissionResults.${scope}.categories`,
          },
        })
        .project({
          _id: 1,
          [scope]: {
            $reduce: {
              input: `$${scope}`,
              initialValue: [],
              in: { $concatArrays: ["$$value", "$$this"] },
            },
          },
        })
        .unwind({
          path: `$${scope}`,
        })
        .sort("_id.year")
        .group({
          _id: {
            category: `$${scope}.category`,
            categoryOrder: `$${scope}.categoryOrder`,
          },
          calculations: {
            $push: {
              year: "$_id.year",
              totalCO2eEmissions: `$${scope}.totalCO2eEmissions`,
            },
          },
        })
        .sort("_id.categoryOrder");
    });

    const scopeBasedCategoryEmissionAggregationResults = await Promise.all(
      scopeBasedCategoryEmissionPipelines
    );

    const scopeCategoryBasedEmissionResults = {
      [CC_EMISSION_SCOPES.SCOPE_1]:
        scopeBasedCategoryEmissionAggregationResults[0],
      [CC_EMISSION_SCOPES.SCOPE_2]:
        scopeBasedCategoryEmissionAggregationResults[1],
      [CC_EMISSION_SCOPES.SCOPE_3]:
        scopeBasedCategoryEmissionAggregationResults[2],
    };

    // scope calculation
    const scopeBasedEmissionPipelines = Object.values(CC_EMISSION_SCOPES).map(
      (scope) => {
        const reportsAggregationPipeline = this.CcReports.aggregate();
        return reportsAggregationPipeline
          .match({
            organization: new mongoose.Types.ObjectId(
              this.connection.user.organizationId
            ),
            year: { $gte: startingYear, $lte: endingYear },
            name: CC_DEFAULT_REPORTS.SINGLE_YEAR_REPORT,
          })
          .group({
            _id: { year: "$year", scope },
            [scope]: {
              $push: `$content.scopeBasedEmissionResults.${scope}.categories`,
            },
          })
          .project({
            _id: 1,
            data: {
              $reduce: {
                input: `$${scope}`,
                initialValue: [],
                in: { $concatArrays: ["$$value", "$$this"] },
              },
            },
          })
          .unwind({
            path: `$data`,
          })
          .group({
            _id: "$_id",
            totalCO2eEmissions: {
              $sum: `$data.totalCO2eEmissions`,
            },
          })
          .sort("_id.year")
          .project({
            _id: 0,
            year: "$_id.year",
            scope: "$_id.scope",
            totalCO2eEmissions: "$totalCO2eEmissions",
          });
      }
    );

    const scopeBasedEmissionAggregationResults = await Promise.all(
      scopeBasedEmissionPipelines
    );

    const scopeBasedEmissionResults = {
      [CC_EMISSION_SCOPES.SCOPE_1]: scopeBasedEmissionAggregationResults[0],
      [CC_EMISSION_SCOPES.SCOPE_2]: scopeBasedEmissionAggregationResults[1],
      [CC_EMISSION_SCOPES.SCOPE_3]: scopeBasedEmissionAggregationResults[2],
    };

    // intensity ratio
    const intesityRatioPipelines = this.CcReports.aggregate()
      .match({
        organization: new mongoose.Types.ObjectId(
          this.connection.user.organizationId
        ),
        year: { $gte: startingYear, $lte: endingYear },
        name: CC_DEFAULT_REPORTS.SINGLE_YEAR_REPORT,
      })
      .group({
        _id: "$year",
        totalCO2ePerMillionOfTurnOver: {
          $sum: {
            $round: [
              "$content.intensityRatio.totalCO2ePerMillionOfTurnOver",
              5,
            ],
          },
        },
        totalCO2ePerEmployee: {
          $sum: {
            $round: ["$content.intensityRatio.totalCO2ePerEmployee", 5],
          },
        },
      })
      .sort("_id");

    const intesityRatioResults = await intesityRatioPipelines;
    return {
      startingYear,
      endingYear,
      scopeBasedEmissionResults,
      intesityRatioResults,
      scopeCategoryBasedEmissionResults,
    };
  }
  async getReport() {
    return this.runAnalysis();
  }
}

module.exports = { HistoricTrendsReport };
