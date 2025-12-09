const { Manager } = require("./manager");
const mongoose = require("mongoose");
class ComplianceStatsService extends Manager {
  constructor(connection) {
    super(connection);
  }

  async complianceStats({ startDate, endDate }) {
    const organizationId = this.connection.user.organizationId;
    const { dateFilter } = this.getDefaultDateRange({ startDate, endDate });

    const complianceRecords = await this.Compliance.find({
      organization: new mongoose.Types.ObjectId(organizationId),
      // ...dateFilter,
    });

    const stats = complianceRecords
      .filter((record) => record.name && record.totalPercentage > 0)
      .map((record) => ({
        [record.name]: record.totalPercentage,
      }));

    return stats;
  }
}

module.exports = { ComplianceStatsService };
