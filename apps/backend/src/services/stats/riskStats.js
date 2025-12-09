const mongoose = require("mongoose");
const { Manager } = require("./manager");

class RiskStatsService extends Manager {
  constructor(connection) {
    super(connection);
  }

  async riskStats({ months = 12 }) {
    const organizationId = this.connection.user.organizationId;
    // Always use the current date as endDate for a true rolling year
    const { startDate, endDate } = this.getDefaultDateRange({
      months,
      endDate: new Date(),
    });
    // Helper to get last N months with year and month
    function getLastNMonths(endDate, months) {
      const MONTH_OF_YEAR = [
        "",
        "JAN",
        "FEB",
        "MAR",
        "APR",
        "MAY",
        "JUN",
        "JUL",
        "AUG",
        "SEP",
        "OCT",
        "NOV",
        "DEC",
      ];
      const result = [];
      let d = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
      d.setMonth(d.getMonth() - (months - 1));
      for (let i = 0; i < months; i++) {
        result.push({
          year: d.getFullYear(),
          month: d.getMonth() + 1,
          label: MONTH_OF_YEAR[d.getMonth() + 1],
        });
        d.setMonth(d.getMonth() + 1);
      }
      return result;
    }
    const monthsMeta = getLastNMonths(endDate, months);
    const monthsArray = monthsMeta.map((m) => m.label);

    // Create a function to initialize arrays with zeros
    const createZeroArray = this.createZeroArray;

    // Aggregation pipeline for risk by type
    const riskByTypePipeline = [
      {
        $match: {
          organization: new mongoose.Types.ObjectId(organizationId),
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: {
            type: "$type",
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: "$_id.type",
          monthlyData: {
            $push: {
              month: "$_id.month",
              year: "$_id.year",
              count: "$count",
            },
          },
        },
      },
    ];

    // Aggregation pipeline for risk by status
    const riskByStatusPipeline = [
      {
        $match: {
          organization: new mongoose.Types.ObjectId(organizationId),
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $facet: {
          open: [
            { $match: { "mitigated.status": false } },
            {
              $group: {
                _id: {
                  month: { $month: "$createdAt" },
                  year: { $year: "$createdAt" },
                },
                count: { $sum: 1 },
              },
            },
          ],
          mitigated: [
            { $match: { "mitigated.status": true } },
            {
              $group: {
                _id: {
                  month: { $month: "$mitigated.on" },
                  year: { $year: "$mitigated.on" },
                },
                count: { $sum: 1 },
              },
            },
          ],
          accepted: [
            { $match: { "accepted.status": true } },
            {
              $group: {
                _id: {
                  month: { $month: "$accepted.on" },
                  year: { $year: "$accepted.on" },
                },
                count: { $sum: 1 },
              },
            },
          ],
          escalated: [
            { $match: { "escalated.status": true } },
            {
              $group: {
                _id: {
                  month: { $month: "$escalated.on" },
                  year: { $year: "$escalated.on" },
                },
                count: { $sum: 1 },
              },
            },
          ],
        },
      },
    ];

    // Aggregation pipeline for top business functions with risks
    const topBusinessFunctionsWithRisksPipeline = [
      {
        $match: {
          organization: new mongoose.Types.ObjectId(organizationId),
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      { $group: { _id: "$group", totalRisks: { $sum: 1 } } },
      { $sort: { totalRisks: -1 } },
      { $limit: 8 },
      {
        $lookup: {
          from: "iamgroups",
          localField: "_id",
          foreignField: "_id",
          as: "groupInfo",
        },
      },
      { $unwind: { path: "$groupInfo", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          businessFunctionName: { $ifNull: ["$groupInfo.name", "Unknown"] },
          totalRisks: 1,
        },
      },
      { $sort: { businessFunctionName: 1 } },
    ];

    // Execute aggregations
    const [
      riskByTypeResult,
      riskByStatusResult,
      topBusinessFunctionsWithRisksResult,
    ] = await Promise.all([
      this.Risk.aggregate(riskByTypePipeline),
      this.Risk.aggregate(riskByStatusPipeline),
      this.Risk.aggregate(topBusinessFunctionsWithRisksPipeline),
    ]);

    // Process risk by type results
    const riskByType = {
      hardware: { risks: createZeroArray(months), months: monthsArray },
      software: { risks: createZeroArray(months), months: monthsArray },
      people: { risks: createZeroArray(months), months: monthsArray },
      premises: { risks: createZeroArray(months), months: monthsArray },
      organizational: { risks: createZeroArray(months), months: monthsArray },
      clinical: { risks: createZeroArray(months), months: monthsArray },
    };

    riskByTypeResult.forEach((typeData) => {
      const type = typeData._id.toLowerCase();
      const monthlyCounts = createZeroArray(months);

      typeData.monthlyData.forEach((data) => {
        // Find the index in monthsMeta
        const idx = monthsMeta.findIndex(
          (m) => m.month === data.month && m.year === data.year
        );
        if (idx !== -1) {
          monthlyCounts[idx] = data.count;
        }
      });

      if (riskByType[type]) {
        riskByType[type].risks = monthlyCounts;
      }
    });

    // Process risk by status results
    const riskByStatus = {
      open: { risks: createZeroArray(months), months: monthsArray },
      mitigated: { risks: createZeroArray(months), months: monthsArray },
      accepted: { risks: createZeroArray(months), months: monthsArray },
      escalated: { risks: createZeroArray(months), months: monthsArray },
    };

    if (riskByStatusResult[0]) {
      Object.keys(riskByStatusResult[0]).forEach((status) => {
        const monthlyCounts = createZeroArray(months);

        riskByStatusResult[0][status].forEach((data) => {
          // Find the index in monthsMeta
          const idx = monthsMeta.findIndex(
            (m) => m.month === data._id.month && m.year === data._id.year
          );
          if (idx !== -1) {
            monthlyCounts[idx] = data.count;
          }
        });

        riskByStatus[status].risks = monthlyCounts;
      });
    }

    // Fetch all business units (groups) for the organization

    const allGroups = await this.Group.find({
      organization: new mongoose.Types.ObjectId(organizationId),
    });

    // Process top business functions with risks
    // Create a map from aggregation result for quick lookup
    const risksMap = new Map();
    if (Array.isArray(topBusinessFunctionsWithRisksResult)) {
      topBusinessFunctionsWithRisksResult.forEach((r) => {
        risksMap.set(r.businessFunctionName, r.totalRisks);
      });
    }
    // Merge all groups, always include up to 8, sorted alphabetically
    const allBusinessUnits = allGroups
      .map((g) => g.name)
      .sort((a, b) => a.localeCompare(b))
      .slice(0, 8);
    const topBusinessFunctionsWithRisks = {
      businessFunctionNames: allBusinessUnits,
      totalRisks: allBusinessUnits.map((name) => risksMap.get(name) || 0),
    };

    return {
      riskByType,
      riskByStatus,
      topBusinessFunctionsWithRisks,
    };
  }
}

module.exports = { RiskStatsService };
