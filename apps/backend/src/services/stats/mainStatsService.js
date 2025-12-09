const { Manager } = require("./manager");
const { GlobalStatsService } = require("./globalStats");
const { DigitalMaturityStatsService } = require("./digitalMaturityStats");
const { IncidentStatsService } = require("./incidentStats");
const { ComplianceStatsService } = require("./complianceStats");
const { AuditStatsService } = require("./auditStats");
const { RiskStatsService } = require("./riskStats");
const { InventoryStatsService } = require("./inventoryStats");
const { SupplierStatsService } = require("./supplierStats");
const { CipStatsService } = require("./cipStats");
const { CrmStatsService } = require("./crmStats");

class MainStatsService extends Manager {
  constructor(connection) {
    super(connection);

    // Initialize all individual stats services
    this.globalStatsService = new GlobalStatsService(connection);
    this.digitalMaturityStatsService = new DigitalMaturityStatsService(
      connection
    );
    this.incidentStatsService = new IncidentStatsService(connection);
    this.complianceStatsService = new ComplianceStatsService(connection);
    this.auditStatsService = new AuditStatsService(connection);
    this.riskStatsService = new RiskStatsService(connection);
    this.inventoryStatsService = new InventoryStatsService(connection);
    this.supplierStatsService = new SupplierStatsService(connection);
    this.cipStatsService = new CipStatsService(connection);
    this.crmStatsService = new CrmStatsService(connection);
  }

  // Delegate methods to individual services
  async globalStats(params) {
    return this.globalStatsService.globalStats(params);
  }

  async digitalMaturityStats() {
    return this.digitalMaturityStatsService.digitalMaturityStats();
  }

  async incidentStats(params) {
    return this.incidentStatsService.incidentStats(params);
  }

  async complianceStats(params) {
    return this.complianceStatsService.complianceStats(params);
  }

  async auditStats(params) {
    return this.auditStatsService.auditStats(params);
  }

  async riskStats(params) {
    return this.riskStatsService.riskStats(params);
  }

  async inventoryStats(params) {
    return this.inventoryStatsService.inventoryStats(params);
  }

  async supplierStats(params) {
    return this.supplierStatsService.supplierStats(params);
  }

  async cipStats(params) {
    return this.cipStatsService.cipStats(params);
  }

  async crmStats(params) {
    return this.crmStatsService.crmStats(params);
  }
}

module.exports = { MainStatsService };
