const { Manager } = require("./manager");

class AuditStatsService extends Manager {
  constructor(connection) {
    super(connection);
  }

  async auditStats({ startDate, endDate }) {
    const organizationId = this.connection.user.organizationId;
    const { dateFilter } = this.getDefaultDateRange({ startDate, endDate });

    const allAudits = await this.Audit.find({
      organization: organizationId,
      ...dateFilter,
    });

    const total = allAudits.length;
    const scheduled = allAudits.filter(
      (audit) => !audit.completed.status
    ).length;

    const nonConformities = await Promise.all(
      allAudits.map(async (audit) => {
        const group = await this.Group.findById(audit.group);
        const nonConformityCount = audit.identifications
          ? audit.identifications.length
          : 0;
        return {
          businessUnit: group ? group.name : null,
          amount: nonConformityCount,
        };
      })
    );

    const nonConformitiesByUnit = nonConformities
      .filter((item) => item.businessUnit)
      .reduce((acc, curr) => {
        const existing = acc.find(
          (item) => item.businessUnit === curr.businessUnit
        );
        if (existing) {
          existing.amount += curr.amount;
        } else {
          acc.push(curr);
        }
        return acc;
      }, []);

    return {
      total,
      scheduled,
      nonConformities: nonConformitiesByUnit,
    };
  }
}

module.exports = { AuditStatsService };
