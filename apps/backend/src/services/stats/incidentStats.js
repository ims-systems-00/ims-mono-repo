const { Manager } = require("./manager");
const {
  USER_TYPE,
  GROUP_TYPE,
  IMS_POLICIES,
} = require("@ims-systems-00/ims-core/lib/constants");

class IncidentStatsService extends Manager {
  constructor(connection) {
    super(connection);
  }

  async incidentStats({ startDate, endDate }) {
    const organizationId = this.connection.user.organizationId;
    const { dateFilter } = this.getDefaultDateRange({ startDate, endDate });

    const allGroups = await this.Group.find({ organization: organizationId });

    const [systemAdminPolicy, compliancePolicy] = await Promise.all([
      this.IamPolicy.findOne({
        name: IMS_POLICIES.IMS_SYSTEM_ADMINISTRATION,
        organization: organizationId,
      }),
      this.IamPolicy.findOne({
        name: IMS_POLICIES.IMS_COMPLIANCE_FUNCTION,
        organization: organizationId,
      }),
    ]);

    const iamGroups = allGroups.filter((group) => {
      if (!systemAdminPolicy || !compliancePolicy) return true;
      return (
        !group.policy.equals(systemAdminPolicy._id) &&
        !group.policy.equals(compliancePolicy._id)
      );
    });

    const incidentsByBusinessFunction = await Promise.all(
      iamGroups.map(async (iamGroup) => {
        const groupIncidents = await this.Incident.find({
          "source.moduleType": { $in: ["incidents", "audits"] },
          group: iamGroup._id,
          ...dateFilter,
        });
        const resolvedGroupIncidents = groupIncidents.filter(
          (incident) => incident.resolved.status
        );

        return {
          name: iamGroup.name,
          total: groupIncidents.length,
          resolved: resolvedGroupIncidents.length,
        };
      })
    );

    return {
      incidentStats: incidentsByBusinessFunction,
    };
  }
}

module.exports = { IncidentStatsService };
