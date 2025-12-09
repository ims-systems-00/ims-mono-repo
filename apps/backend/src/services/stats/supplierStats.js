const { Manager } = require("./manager");

class SupplierStatsService extends Manager {
  constructor(connection) {
    super(connection);
  }

  async supplierStats({ startDate, endDate }) {
    const organizationId = this.connection.user.organizationId;
    const { dateFilter } = this.getDefaultDateRange({ startDate, endDate });

    const [suppliers, incidents, contracts] = await Promise.all([
      this.Supplier.find({ organization: organizationId }),
      this.Incident.find({
        organization: organizationId,
        "source.moduleType": "suppliers",
        ...dateFilter,
      }),
      this.Supplier.aggregate([
        {
          $match: { organization: organizationId },
        },
        {
          $group: {
            _id: null,
            totalValue: { $sum: "$contractValue" },
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

    const compliantSuppliers = suppliers.filter((s) => s.isCompliant);
    const nonCompliantSuppliers = suppliers.filter((s) => !s.isCompliant);
    const compliancePercentage = suppliers.length
      ? Math.round((compliantSuppliers.length / suppliers.length) * 100)
      : 0;

    let riskLevel = "Safe";
    if (compliancePercentage <= 20) riskLevel = "Hazardous";
    else if (compliancePercentage <= 40) riskLevel = "Vulnerable";
    else if (compliancePercentage <= 60) riskLevel = "Unsecure";
    else if (compliancePercentage <= 80) riskLevel = "Secure";
    else riskLevel = "Safe";

    const openIncidents = incidents.filter((i) => !i.resolved.status);
    const resolvedIncidents = incidents.filter((i) => i.resolved.status);

    return {
      procurementValue: contracts[0]?.totalValue || 0,
      supplierIncidents: {
        totalIncidents: incidents.length,
        openIncidents: openIncidents.length,
        resolvedIncidents: resolvedIncidents.length,
      },
      supplierCompliance: {
        compliant: compliantSuppliers.length,
        inCompliant: nonCompliantSuppliers.length,
        percentage: compliancePercentage,
        riskLevel: riskLevel,
      },
    };
  }
}

module.exports = { SupplierStatsService };
