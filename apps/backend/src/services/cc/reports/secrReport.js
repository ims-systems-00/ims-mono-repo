const { Manager } = require("../manager");
const mongoose = require("mongoose");
const {
  CC_EMISSION_CATEGORY_NAMES,
} = require("../../../models/mongodb/system/cc/ccEnum");
const { APIError } = require("../../../helpers/errors/apiError");
const { ReasonPhrases, StatusCodes } = require("http-status-codes");

class SecrReport extends Manager {
  constructor(connection) {
    super(connection);
  }

  async getReport({ reportingYear, compareYear }) {
    if (!reportingYear || !compareYear) {
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Both reportingYear and compareYear are required"
      );
    }
    const orgId = this.connection.user.organizationId;

    const categories = {
      stationaryCombustion: CC_EMISSION_CATEGORY_NAMES.COMPANY_PREMISES,
      mobileCombustion: CC_EMISSION_CATEGORY_NAMES.COMPANY_VEHICLES,
      purchasedElectricity: CC_EMISSION_CATEGORY_NAMES.PURCHASED_ELECTRICITY,
      businessTravelGreyFleet: CC_EMISSION_CATEGORY_NAMES.BUSINESS_TRAVEL,
    };

    const aggregateForYear = async (year) => {
      const results = await this.CcCalculation.aggregate([
        {
          $match: {
            organization: new mongoose.Types.ObjectId(orgId),
            reportingYear: Number(year),
            category: { $in: Object.values(categories) },
          },
        },
        {
          $group: {
            _id: "$category",
            totalEnergy: { $sum: "$secrEnergy" },
            totalEmissions: { $sum: "$ghgCo2eEmission" },
          },
        },
      ]);

      const resultMap = {};
      results.forEach((r) => {
        resultMap[r._id] = r;
      });

      const energy = {};
      const emissions = {};
      let totalEnergyConsumption = 0;
      let totalEmissions = 0;

      Object.entries(categories).forEach(([key, cat]) => {
        const found = resultMap[cat];
        const energyVal = found ? found.totalEnergy : 0;
        const emissionsVal = found ? found.totalEmissions : 0;
        energy[key] = energyVal;
        emissions[key] = emissionsVal;
        totalEnergyConsumption += energyVal;
        totalEmissions += emissionsVal;
      });

      energy.totalEnergyConsumption = totalEnergyConsumption;
      emissions.totalEmissions = totalEmissions;
      return { energy, emissions };
    };

    const [reporting, compare] = await Promise.all([
      aggregateForYear(reportingYear),
      aggregateForYear(compareYear),
    ]);

    // Get turnover for both years
    const parameter = await this.CcParameter.findOne({
      organization: orgId,
    });
    let reportingTurnover = 0;
    let compareTurnover = 0;
    if (parameter && parameter.reportingYears) {
      const reportingYearConfig = parameter.reportingYears.find(
        (y) => String(y.year) === String(reportingYear)
      );
      const compareYearConfig = parameter.reportingYears.find(
        (y) => String(y.year) === String(compareYear)
      );
      reportingTurnover = reportingYearConfig?.turnOver || 0;
      compareTurnover = compareYearConfig?.turnOver || 0;
    }
    return {
      statusCode: 200,
      reportingYear: {
        year: String(reportingYear),
        energy: reporting.energy,
        emissions: reporting.emissions,
        intensityRatio: {
          Turnover: reportingTurnover,
          tCO2ePerMillionTurnover:
            reportingTurnover > 0
              ? (reporting.emissions.totalEmissions / reportingTurnover) *
                1000000
              : 0,
        },
      },
      compareYear: {
        year: String(compareYear),
        energy: compare.energy,
        emissions: compare.emissions,
        intensityRatio: {
          Turnover: compareTurnover,
          tCO2ePerMillionTurnover:
            compareTurnover > 0
              ? (compare.emissions.totalEmissions / compareTurnover) * 1000000
              : 0,
        },
      },
    };
  }
}

module.exports = { SecrReport };
