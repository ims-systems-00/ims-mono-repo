const { Manager } = require("./manager");
const mongoose = require("mongoose");

class CrmStatsService extends Manager {
  constructor(connection) {
    super(connection);
  }

  async crmStats({ startDate, endDate }) {
    const organizationId = this.connection.user.organizationId;
    const { dateFilter } = this.getDefaultDateRange({ startDate, endDate });

    // Aggregate contractValue by stage
    const possibleStages = [
      "Live",
      "Prospect",
      "Warm lead",
      "Qualified",
      "Proposal",
    ];
    const contractValueByStageRaw = await this.Customer.aggregate([
      {
        $match: {
          organization: new mongoose.Types.ObjectId(organizationId),
          ...dateFilter,
        },
      },
      {
        $group: {
          _id: "$stage",
          totalContractValue: { $sum: { $toDouble: "$contractValue" } },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          stage: "$_id",
          totalContractValue: 1,
          count: 1,
          _id: 0,
        },
      },
    ]);

    const now = new Date();
    const oneYearAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1);

    const invoiceStatsByMonth = await this.Invoice.aggregate([
      {
        $match: {
          status: "Sent",
          organization: new mongoose.Types.ObjectId(organizationId),
          createdAt: { $gte: oneYearAgo, $lte: now },
        },
      },
      {
        $addFields: {
          monthNum: { $month: "$createdAt" },
          year: { $year: "$createdAt" },
        },
      },
      {
        $addFields: {
          monthName: {
            $arrayElemAt: [
              [
                "",
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
              ],
              "$monthNum",
            ],
          },
        },
      },
      {
        $group: {
          _id: {
            year: "$year",
            monthNum: "$monthNum",
            monthName: "$monthName",
          },
          invoiceCount: { $sum: 1 },
          totalAmount: { $sum: { $toDouble: "$calculations.total" } },
        },
      },
      {
        $project: {
          month: "$_id.monthName",
          year: "$_id.year",
          invoiceCount: 1,
          totalAmount: 1,
          _id: 0,
        },
      },
      { $sort: { year: 1, "_id.monthNum": 1 } },
    ]);

    // Helper to get last 12 months (oldest to newest)
    function getLast12Months() {
      const months = [
        "",
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      const result = [];
      const now = new Date();
      for (let i = 11; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        result.push({
          month: months[d.getMonth() + 1],
          year: d.getFullYear(),
        });
      }
      return result;
    }

    const last12Months = getLast12Months();
    // Merge aggregation result with all months
    const invoiceStatsByMonthFilled = last12Months.map(({ month, year }) => {
      const found = invoiceStatsByMonth.find(
        (m) => m.month === month && m.year === year
      );
      return {
        month,
        invoiceCount: found ? found.invoiceCount : 0,
        totalAmount: found ? found.totalAmount : 0,
      };
    });

    // Ensure all stages are present, fill missing with 0
    const contractValueByStage = possibleStages.map((stage) => {
      const found = contractValueByStageRaw.find((s) => s.stage === stage);
      return found || { stage, totalContractValue: 0, count: 0 };
    });

    const customers = await this.Customer.find({
      organization: organizationId,
      ...dateFilter,
    });

    const totalContractValue = customers.reduce(
      (total, customer) => total + (parseFloat(customer.contractValue) || 0),
      0
    );

    const averageContractValue = customers.length
      ? Math.round(totalContractValue / customers.length)
      : 0;

    const sortedCustomers = [...customers].sort(
      (a, b) =>
        (parseFloat(b.contractValue) || 0) - (parseFloat(a.contractValue) || 0)
    );

    const highestContractValue = sortedCustomers.length
      ? {
          name: sortedCustomers[0].name || "Unknown",
          value: parseFloat(sortedCustomers[0].contractValue) || 0,
        }
      : {
          name: "No customer",
          value: 0,
        };

    const lowestContractValue = sortedCustomers.length
      ? {
          name: sortedCustomers[sortedCustomers.length - 1].name || "Unknown",
          value:
            parseFloat(
              sortedCustomers[sortedCustomers.length - 1].contractValue
            ) || 0,
        }
      : {
          name: "No customer",
          value: 0,
        };

    return {
      crmStats: {
        totalContractValue,
        averageContractValue,
        highestContractValue,
        lowestContractValue,
        contractValueByStage,
        invoiceStatsByMonth: invoiceStatsByMonthFilled, // <-- always 12 months
      },
    };
  }
}

module.exports = { CrmStatsService };
