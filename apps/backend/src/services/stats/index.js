module.exports = {
  // Main service that combines all stats
  StatsService: require("./mainStatsService").MainStatsService,

  // Individual services for specific use cases
  GlobalStatsService: require("./globalStats").GlobalStatsService,
  DigitalMaturityStatsService: require("./digitalMaturityStats")
    .DigitalMaturityStatsService,
  IncidentStatsService: require("./incidentStats").IncidentStatsService,
  ComplianceStatsService: require("./complianceStats").ComplianceStatsService,
  AuditStatsService: require("./auditStats").AuditStatsService,
  RiskStatsService: require("./riskStats").RiskStatsService,
  InventoryStatsService: require("./inventoryStats").InventoryStatsService,
  SupplierStatsService: require("./supplierStats").SupplierStatsService,
  CipStatsService: require("./cipStats").CipStatsService,
  CrmStatsService: require("./crmStats").CrmStatsService,
};
