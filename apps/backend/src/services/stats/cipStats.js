const { Manager } = require("./manager");

class CipStatsService extends Manager {
  constructor(connection) {
    super(connection);
  }

  async cipStats({ startDate, endDate }) {
    const organizationId = this.connection.user.organizationId;
    const { dateFilter } = this.getDefaultDateRange({ startDate, endDate });

    const cips = await this.Cip.find({
      organization: organizationId,
      ...dateFilter,
    });

    const groups = await this.Group.find({ organization: organizationId });

    const stats = groups.map((group) => ({
      name: group.name,
      opportunities: 0,
      improvements: 0,
    }));

    cips.forEach((cip) => {
      const groupIndex = stats.findIndex(
        (stat) => stat.name === cip.group?.name
      );
      if (groupIndex !== -1) {
        stats[groupIndex].opportunities++;
        if (cip.implemented?.status === "Implemented") {
          stats[groupIndex].improvements++;
        }
      }
    });

    return {
      cipStats: stats,
    };
  }
}

module.exports = { CipStatsService };
