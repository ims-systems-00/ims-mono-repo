const { Manager } = require("../manager");
const { APIError } = require("../../../helpers/errors/apiError");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const mongoose = require("mongoose");
const {
  CC_EMISSION_SCOPES,
  CC_EMISSION_SCOPE_1_CATEGORY_NAMES,
  CC_EMISSION_SCOPE_2_CATEGORY_NAMES,
  CC_EMISSION_SCOPE_3_CATEGORY_NAMES,
  CC_EMISSION_CATEGORY_ORDERS,
  CC_EMISSION_CATEGORY_NAMES,
  CC_DEFAULT_REPORTS,
  CC_DATA_QUALITY_GRADES,
  CC_CALCULATION_METHODS,
  CC_EMISSION_SCOPE_NAMES,
  CC_RELEVANCE,
} = require("../../../models/mongodb/system/cc/ccEnum");
const { parseBooleanQuery } = require("../../../helpers/parseBooleanQuery");
const ACTIVITY_BASED_RESULT_LIMIT = 10;
let SCOPE_CATEGORIES_MAP = {
  [CC_EMISSION_SCOPES.SCOPE_1]: Object.values(
    CC_EMISSION_SCOPE_1_CATEGORY_NAMES
  ),
  [CC_EMISSION_SCOPES.SCOPE_2]: Object.values(
    CC_EMISSION_SCOPE_2_CATEGORY_NAMES
  ),
  [CC_EMISSION_SCOPES.SCOPE_3]: Object.values(
    CC_EMISSION_SCOPE_3_CATEGORY_NAMES
  ),
};
class SingleYearReport extends Manager {
  constructor(connection) {
    super(connection);
  }
  getCategoryStructure() {
    return {
      category: "-",
      categoryOrder: "-",
      percentageCO2eOfTotal: 0,
      totalCO2eEmissions: 0,
      totalCO2Emissions: 0,
      totalN2OEmissions: 0,
      totalCH4Emissions: 0,
      totalNF3Emissions: 0,
      totalPFCEmissions: 0,
      totalSF6Emissions: 0,
      totalHFCEmissions: 0,
      adGradeScore: 0,
      efGradeScore: 0,
      adGrade: "-",
      efGrade: "-",
    };
  }
  getAllScopeBasedCategoriesStrucuture(scope) {
    return SCOPE_CATEGORIES_MAP[scope].map((category) => {
      return {
        ...this.getCategoryStructure(),
        category: category,
        categoryOrder: CC_EMISSION_CATEGORY_ORDERS[category],
      };
    });
  }
  getDefaultScopeBasedOutputFormat(scope) {
    return {
      _id: scope,
      categories: this.getAllScopeBasedCategoriesStrucuture(scope),
      grandTotalCO2eEmissions: 0,
      grandPercentageCO2eOfTotal: 0,
    };
  }
  async runAnalysis(reportingYear = null, parameter) {
    /** prerequisites before running analysis */
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
    if (!reportingYear) {
      let now = new Date();
      reportingYear = now.getFullYear();
    }

    /**
     * scope based results
     */
    const scopeBasedEmissionPipelines = Object.values(CC_EMISSION_SCOPES).map(
      (scope) => {
        const allCategories = this.getAllScopeBasedCategoriesStrucuture(scope);
        const reportnigBoundaries = parameter?.reportingBoundaries?.filter(
          (b) => b.relevance !== CC_RELEVANCE.NOT_RELEVANT
        );
        const pipeline = this.CcCalculation.aggregate();
        pipeline
          .match({
            organization: new mongoose.Types.ObjectId(
              this.connection.user.organizationId
            ),
            scope,
            reportingYear,
            category: {
              $in: reportnigBoundaries?.map?.((c) => c.category),
            },
          })
          .group({
            _id: {
              category: "$category",
              categoryOrder: "$categoryOrder",
            },
            totalCO2eEmissions: {
              $sum: "$ghgCo2eEmission",
            },
            totalCO2Emissions: {
              $sum: "$ghgCo2Emission",
            },
            totalN2OEmissions: {
              $sum: "$ghgN2oEmission",
            },
            totalCH4Emissions: {
              $sum: "$ghgCh4Emission",
            },
            totalNF3Emissions: {
              $sum: "$ghgNf3Emission",
            },
            totalPFCEmissions: {
              $sum: "$ghgPfcEmission",
            },
            totalSF6Emissions: {
              $sum: "$ghgSf6Emission",
            },
            totalHFCEmissions: {
              $sum: "$ghgHfcEmission",
            },
            totalEfScore: {
              $sum: "$dataQualityEmissionFactorScore",
            },
            totalAdScore: {
              $sum: "$dataQualityADScore",
            },
            totalDataCount: {
              $sum: 1,
            },
          })
          .group({
            _id: null,
            categories: {
              $push: {
                category: "$_id.category",
                categoryOrder: "$_id.categoryOrder",
                totalCO2eEmissions: "$totalCO2eEmissions",
                totalCO2Emissions: "$totalCO2Emissions",
                totalN2OEmissions: "$totalN2OEmissions",
                totalCH4Emissions: "$totalCH4Emissions",
                totalNF3Emissions: "$totalNF3Emissions",
                totalPFCEmissions: "$totalPFCEmissions",
                totalSF6Emissions: "$totalSF6Emissions",
                totalHFCEmissions: "$totalHFCEmissions",
                adGradeScore: {
                  $round: [
                    {
                      $cond: {
                        if: { $eq: ["$totalDataCount", 0] },
                        then: "-",
                        else: {
                          $divide: ["$totalAdScore", "$totalDataCount"],
                        },
                      },
                    },
                    2,
                  ],
                },
                efGradeScore: {
                  $round: [
                    {
                      $cond: {
                        if: { $eq: ["$totalDataCount", 0] },
                        then: "-",
                        else: {
                          $divide: ["$totalEfScore", "$totalDataCount"],
                        },
                      },
                    },
                    2,
                  ],
                },
              },
            },
            grandTotalCO2eEmissions: {
              $sum: "$totalCO2eEmissions",
            },
          })
          .project({
            _id: null,
            categories: {
              $setUnion: [
                "$categories",
                {
                  $filter: {
                    input: allCategories,
                    as: "item",
                    cond: {
                      $not: [
                        {
                          $in: [
                            "$$item.category",
                            {
                              $map: {
                                input: "$categories",
                                as: "filterItem",
                                in: "$$filterItem.category",
                              },
                            },
                          ],
                        },
                      ],
                    },
                  },
                },
              ],
            },
            grandTotalCO2eEmissions: "$grandTotalCO2eEmissions",
          })
          .unwind({
            path: "$categories",
          })
          .project({
            _id: "$categories.category",
            categoryOrder: "$categories.categoryOrder",
            totalCO2eEmissions: "$categories.totalCO2eEmissions",
            totalCO2Emissions: "$categories.totalCO2Emissions",
            totalN2OEmissions: "$categories.totalN2OEmissions",
            totalCH4Emissions: "$categories.totalCH4Emissions",
            totalNF3Emissions: "$categories.totalNF3Emissions",
            totalPFCEmissions: "$categories.totalPFCEmissions",
            totalSF6Emissions: "$categories.totalSF6Emissions",
            totalHFCEmissions: "$categories.totalHFCEmissions",
            adGradeScore: "$categories.adGradeScore",
            efGradeScore: "$categories.efGradeScore",
            percentageCO2eOfTotal: {
              $round: [
                {
                  $cond: {
                    if: { $eq: ["$grandTotalCO2eEmissions", 0] },
                    then: 0,
                    else: {
                      $multiply: [
                        {
                          $divide: [
                            "$categories.totalCO2eEmissions",
                            "$grandTotalCO2eEmissions",
                          ],
                        },
                        100,
                      ],
                    },
                  },
                },
                5,
              ],
            },
          })
          .sort("categoryOrder")
          .group({
            _id: scope,
            categories: {
              $push: {
                category: "$_id",
                categoryOrder: "$categoryOrder",
                totalCO2eEmissions: "$totalCO2eEmissions",
                totalCO2Emissions: "$totalCO2Emissions",
                totalN2OEmissions: "$totalN2OEmissions",
                totalCH4Emissions: "$totalCH4Emissions",
                totalNF3Emissions: "$totalNF3Emissions",
                totalPFCEmissions: "$totalPFCEmissions",
                totalSF6Emissions: "$totalSF6Emissions",
                totalHFCEmissions: "$totalHFCEmissions",
                adGradeScore: "$adGradeScore",
                efGradeScore: "$efGradeScore",
                adGrade: {
                  $switch: {
                    branches: [
                      {
                        case: { $gt: ["$adGradeScore", 0.8] },
                        then: CC_DATA_QUALITY_GRADES.VERY_GOOD,
                      },
                      {
                        case: { $gt: ["$adGradeScore", 0.6] },
                        then: CC_DATA_QUALITY_GRADES.GOOD,
                      },
                      {
                        case: { $gt: ["$adGradeScore", 0.4] },
                        then: CC_DATA_QUALITY_GRADES.FAIR,
                      },
                      {
                        case: { $gt: ["$adGradeScore", 0.2] },
                        then: CC_DATA_QUALITY_GRADES.BASIC,
                      },
                    ],
                    default: "-",
                  },
                },
                efGrade: {
                  $switch: {
                    branches: [
                      {
                        case: { $gt: ["$efGradeScore", 0.8] },
                        then: CC_DATA_QUALITY_GRADES.VERY_GOOD,
                      },
                      {
                        case: { $gt: ["$efGradeScore", 0.6] },
                        then: CC_DATA_QUALITY_GRADES.GOOD,
                      },
                      {
                        case: { $gt: ["$efGradeScore", 0.4] },
                        then: CC_DATA_QUALITY_GRADES.FAIR,
                      },
                      {
                        case: { $gt: ["$efGradeScore", 0.2] },
                        then: CC_DATA_QUALITY_GRADES.BASIC,
                      },
                    ],
                    default: "-",
                  },
                },
                percentageCO2eOfTotal: "$percentageCO2eOfTotal",
              },
            },
            grandPercentageCO2eOfTotal: {
              $sum: "$percentageCO2eOfTotal",
            },
            grandTotalCO2eEmissions: {
              $sum: "$totalCO2eEmissions",
            },
            grandTotalCO2Emissions: {
              $sum: "$totalCO2Emissions",
            },
            grandTotalN2OEmissions: {
              $sum: "$totalN2OEmissions",
            },
            grandTotalCH4Emissions: {
              $sum: "$totalCH4Emissions",
            },
            grandTotalNF3Emissions: {
              $sum: "$totalNF3Emissions",
            },

            grandTotalPFCEmissions: {
              $sum: "$totalPFCEmissions",
            },
            grandTotalSF6Emissions: {
              $sum: "$totalSF6Emissions",
            },
            grandTotalHFCEmissions: {
              $sum: "$totalHFCEmissions",
            },
          });
        return pipeline;
      }
    );

    const totalFuelAndEnergyAcitivites = await this.CcCalculation.aggregate([
      {
        $match: {
          organization: new mongoose.Types.ObjectId(
            this.connection.user.organizationId
          ),
          reportingYear,
          // calculationMethod: CC_CALCULATION_METHODS.FUEL_BASED_METHOD,
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$ghgWellToTankCo2eEmission",
          },
        },
      },
    ]);

    const scopeBasedEmissionAggregationResults = await Promise.all(
      scopeBasedEmissionPipelines
    );

    const scope3EmissionResults =
      scopeBasedEmissionAggregationResults[2][0] ||
      this.getDefaultScopeBasedOutputFormat(CC_EMISSION_SCOPES.SCOPE_3);

    scope3EmissionResults.grandTotalCO2eEmissions =
      scope3EmissionResults.grandTotalCO2eEmissions +
      totalFuelAndEnergyAcitivites[0]?.total;

    const feraCategoryResult = {
      ...this.getCategoryStructure(),
      category: "Fuel and Energy Related Activities",
      categoryOrder: "-",
      totalCO2eEmissions: totalFuelAndEnergyAcitivites[0]?.total || 0,
      percentageCO2eOfTotal: 0,
    };

    scope3EmissionResults.categories.splice(2, 0, feraCategoryResult);
    scope3EmissionResults.categories = scope3EmissionResults.categories.map(
      (cat) => {
        return {
          ...cat,
          percentageCO2eOfTotal:
            (cat.totalCO2eEmissions /
              scope3EmissionResults.grandTotalCO2eEmissions) *
            100,
        };
      }
    );

    const scopeBasedEmissionResults = {
      [CC_EMISSION_SCOPES.SCOPE_1]:
        scopeBasedEmissionAggregationResults[0][0] ||
        this.getDefaultScopeBasedOutputFormat(CC_EMISSION_SCOPES.SCOPE_1),
      [CC_EMISSION_SCOPES.SCOPE_2]:
        scopeBasedEmissionAggregationResults[1][0] ||
        this.getDefaultScopeBasedOutputFormat(CC_EMISSION_SCOPES.SCOPE_2),
      [CC_EMISSION_SCOPES.SCOPE_3]: scope3EmissionResults,
    };

    const reportingYearConfig = parameter.reportingYears.find(
      (y) => y.year === reportingYear
    );
    const turnOverInReportingYear = reportingYearConfig?.turnOver || 0;
    const employeeCountsInReportingYear =
      reportingYearConfig?.employeeCount || 0;

    const scopeBasedEmissionSummary = {
      grandTotalCO2eEmissions: Object.values(scopeBasedEmissionResults).reduce(
        (total, accumulator) => {
          return total + accumulator.grandTotalCO2eEmissions;
        },
        0
      ),
      grandPercentageCO2eOfTotal: Object.values(
        scopeBasedEmissionResults
      ).reduce((total, accumulator) => {
        return total + accumulator.grandPercentageOfTotal;
      }, 0),
    };

    const intensityRatio = {
      totalCO2ePerMillionOfTurnOver:
        (scopeBasedEmissionSummary.grandTotalCO2eEmissions /
          turnOverInReportingYear) *
        1000000,
      totalCO2ePerEmployee:
        scopeBasedEmissionSummary.grandTotalCO2eEmissions /
        employeeCountsInReportingYear,
    };

    /**
     * out of scope based results
     */
    const outOfScoperesultId = reportingYear + " Biogenic CO2e";

    const outOfScopeEmissionAggregationPipelineCompanyPremises =
      this.CcCalculation.aggregate()
        .match({
          organization: new mongoose.Types.ObjectId(
            this.connection.user.organizationId
          ),
          category: CC_EMISSION_CATEGORY_NAMES.COMPANY_PREMISES,
          reportingYear,
        })
        .group({
          _id: `${CC_EMISSION_CATEGORY_NAMES.COMPANY_PREMISES} (${CC_EMISSION_SCOPES.SCOPE_1}, ${CC_EMISSION_SCOPE_NAMES.SCOPE_1_NAME})`,
          totalGhgBiogenicCo2Emission: {
            $sum: "$ghgBiogenicCo2Emission",
          },
        });
    const outOfScopeEmissionAggregationPipelineCompanyVehicles =
      this.CcCalculation.aggregate()
        .match({
          organization: new mongoose.Types.ObjectId(
            this.connection.user.organizationId
          ),
          category: CC_EMISSION_CATEGORY_NAMES.COMPANY_VEHICLES,
          reportingYear,
        })
        .group({
          _id: `${CC_EMISSION_CATEGORY_NAMES.COMPANY_VEHICLES} (${CC_EMISSION_SCOPES.SCOPE_1}, ${CC_EMISSION_SCOPE_NAMES.SCOPE_1_NAME})`,
          totalGhgBiogenicCo2Emission: {
            $sum: "$ghgBiogenicCo2Emission",
          },
        });
    const outOfScopeEmissionAggregationPipelinePurchasedElectricity =
      await this.CcCalculation.aggregate()
        .match({
          organization: new mongoose.Types.ObjectId(
            this.connection.user.organizationId
          ),
          category: CC_EMISSION_CATEGORY_NAMES.PURCHASED_ELECTRICITY,
          calculationMethod: CC_CALCULATION_METHODS.LOCATION_BASED_METHOD,
          reportingYear,
        })
        .group({
          _id: `${CC_EMISSION_CATEGORY_NAMES.PURCHASED_ELECTRICITY} (${CC_EMISSION_SCOPES.SCOPE_2}, ${CC_EMISSION_SCOPE_NAMES.SCOPE_2_NAME})`,
          totalGhgBiogenicCo2Emission: {
            $sum: "$ghgBiogenicCo2Emission",
          },
        });
    const outOfScopeEmissionAggregationPipelineOtherTransport =
      await this.CcCalculation.aggregate()
        .match({
          organization: new mongoose.Types.ObjectId(
            this.connection.user.organizationId
          ),
          category: {
            $in: [
              CC_EMISSION_CATEGORY_NAMES.UPSTREAM_TRANSPORTATION_AND_DISTRIBUTION,
              CC_EMISSION_CATEGORY_NAMES.BUSINESS_TRAVEL,
              CC_EMISSION_CATEGORY_NAMES.EMPLOYEE_COMMUTING,
              CC_EMISSION_CATEGORY_NAMES.DOWNSTREAM_TRANSPORTATION_AND_DISTRIBUTION,
            ],
          },
          reportingYear,
        })
        .group({
          _id: `Other transport (${CC_EMISSION_SCOPES.SCOPE_3}, ${CC_EMISSION_SCOPE_NAMES.SCOPE_3_NAME})`,
          totalGhgBiogenicCo2Emission: {
            $sum: "$ghgBiogenicCo2Emission",
          },
        });
    const [
      [outOfScopeEmissionAggregationResultsCompanyPremises],
      [outOfScopeEmissionAggregationResultsCompanyVehicles],
      [outOfScopeEmissionAggregationResultsPurchasedElectricity],
      [outOfScopeEmissionAggregationResultsOtherTransport],
    ] = await Promise.all([
      outOfScopeEmissionAggregationPipelineCompanyPremises,
      outOfScopeEmissionAggregationPipelineCompanyVehicles,
      outOfScopeEmissionAggregationPipelinePurchasedElectricity,
      outOfScopeEmissionAggregationPipelineOtherTransport,
    ]);
    let grandTotalGhgBiogenicCo2Emission = [
      outOfScopeEmissionAggregationResultsCompanyPremises,
      outOfScopeEmissionAggregationResultsCompanyVehicles,
      outOfScopeEmissionAggregationResultsPurchasedElectricity,
      outOfScopeEmissionAggregationResultsOtherTransport,
    ].reduce(
      (total, calc) => total + (calc?.totalGhgBiogenicCo2Emission || 0),
      0
    );
    const outOfScopeEmissionResults = {
      _id: outOfScoperesultId,
      totalGhgBiogenicCo2Emission: grandTotalGhgBiogenicCo2Emission,
      breakdown: [
        outOfScopeEmissionAggregationResultsCompanyPremises,
        outOfScopeEmissionAggregationResultsCompanyVehicles,
        outOfScopeEmissionAggregationResultsPurchasedElectricity,
        outOfScopeEmissionAggregationResultsOtherTransport,
      ],
    };

    /**
     * activity based results
     */
    const activityBasedEmissionPipeline = this.CcCalculation.aggregate();
    const activityBasedEmissionResults = await activityBasedEmissionPipeline
      .match({
        organization: new mongoose.Types.ObjectId(
          this.connection.user.organizationId
        ),
        reportingYear,
      })
      .group({
        _id: "$activity",
        totalCO2eEmissions: {
          $sum: "$ghgCo2eEmission",
        },
      })
      .sort({
        totalCO2eEmissions: -1,
      })
      .facet({
        topActivities: [
          {
            $limit: ACTIVITY_BASED_RESULT_LIMIT,
          },
        ],
        remaining: [
          {
            $skip: ACTIVITY_BASED_RESULT_LIMIT,
          },
          {
            $group: {
              _id: null,
              remainingTotal: {
                $sum: "$totalCO2eEmissions",
              },
            },
          },
        ],
      })
      .project({
        result: {
          $concatArrays: [
            "$topActivities",
            [
              {
                _id: "Remaining activities",
                totalCO2eEmissions: {
                  $ifNull: [
                    {
                      $arrayElemAt: ["$remaining.remainingTotal", 0],
                    },
                    0,
                  ],
                },
              },
            ],
          ],
        },
      })
      .unwind({
        path: "$result",
      })
      .replaceRoot("$result");

    /**
     * contractual intruments for GHG statement
     */
    const totalRenewablePurchasedElectricityPipeline =
      this.CcCalculation.aggregate()
        .match({
          organization: new mongoose.Types.ObjectId(
            this.connection.user.organizationId
          ),
          category: CC_EMISSION_CATEGORY_NAMES.PURCHASED_ELECTRICITY,
          reportingYear,
        })
        .group({
          _id: null,
          total: {
            $sum: "$purchasedElectricityRenewables",
          },
        });
    const totalMarketBasedElectricityEmissionsCO2ePipeline =
      this.CcCalculation.aggregate()
        .match({
          organization: new mongoose.Types.ObjectId(
            this.connection.user.organizationId
          ),
          category: CC_EMISSION_CATEGORY_NAMES.PURCHASED_ELECTRICITY,
          calculationMethod: CC_CALCULATION_METHODS.MARKET_BASED_METHOD,
          reportingYear,
        })
        .group({
          _id: null,
          total: {
            $sum: "$ghgCo2eEmission",
          },
        });
    const [
      [totalRenewablePurchasedElectricity],
      [totalMarketBasedElectricityEmissionsCO2e],
    ] = await Promise.all([
      totalRenewablePurchasedElectricityPipeline,
      totalMarketBasedElectricityEmissionsCO2ePipeline,
    ]);
    const contractualInstrumemtsForGHGResults = {
      totalRenewablePurchasedElectricity:
        totalRenewablePurchasedElectricity?.total || 0,
      totalMarketBasedElectricityEmissionsCO2e:
        totalMarketBasedElectricityEmissionsCO2e?.total || 0,
    };
    /**
     * figures
     */
    const totalActivities = await this.CcCalculation.countDocuments({
      organization: this.connection.user.organizationId,
      reportingYear,
    });
    const totalCustomFactors = await this.CcCustomFactor.countDocuments({
      organization: this.connection.user.organizationId,
      year: reportingYear,
    });
    const analytics = {
      reportingYear,
      totalCustomFactors,
      totalActivities,
      scopeBasedEmissionResults,
      scopeBasedEmissionSummary,
      intensityRatio,
      outOfScopeEmissionResults,
      activityBasedEmissionResults,
      contractualInstrumemtsForGHGResults,
      totalFuelAndEnergyAcitivites: totalFuelAndEnergyAcitivites[0]?.total || 0,
    };
    await this.CcReports.updateOne(
      {
        organization: this.connection.user?.organizationId,
        year: reportingYear,
        name: CC_DEFAULT_REPORTS.SINGLE_YEAR_REPORT,
      },
      {
        $set: {
          content: analytics,
        },
      },
      {
        upsert: true,
      }
    );
    return analytics;
  }
  async getReport(query) {
    let parameter = await this.CcParameter.findOne({
      organization: this.connection.user.organizationId,
    });
    if (!parameter)
      throw new APIError(
        ReasonPhrases.NOT_FOUND,
        StatusCodes.NOT_FOUND,
        "Please configure parameters to get a single year report."
      );
    let baseYearReport = null;
    let baseYearCompare = parseBooleanQuery(query?.baseYearCompare);
    if (baseYearCompare) {
      baseYearReport = await this.runAnalysis(
        Number(parameter.baseReportingYear),
        parameter
      );
    }
    let singleYearReport = await this.runAnalysis(
      Number(query?.reportingYear),
      parameter
    );
    return { baseYearReport, singleYearReport };
  }
}

module.exports = { SingleYearReport };
