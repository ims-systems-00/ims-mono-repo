const { Manager } = require("./manager");
const mongoose = require("mongoose");
const { GROUP_TYPE } = require("@ims-systems-00/ims-core/lib/constants");
const ObjectId = mongoose.Types.ObjectId;

class DigitalMaturityStatsService extends Manager {
  constructor(connection) {
    super(connection);
  }

  async digitalMaturityStats() {
    const organizationId = new mongoose.Types.ObjectId(
      this.connection.user.organizationId
    );
    console.log("Organization ID:", organizationId);

    try {
      console.log(
        "Calculating digital maturity for organization:",
        organizationId
      );

      // Get all business units
      const businessUnits = await this.Group.find({
        organization: organizationId,
        type: GROUP_TYPE.INTERNAL_BU,
      });

      console.log("Business units found:", businessUnits.length);

      if (!businessUnits.length) {
        console.log("No business units found, returning default matrix");
        return {
          organisationalMaturity: this.getDefaultOrganisationalMaturity(),
          businessUnitMaturity: [],
        };
      }

      // Calculate business unit maturity
      const businessUnitResults = await this.calculateBusinessUnitMaturities(
        businessUnits
      );

      // Calculate organizational maturity from business unit results
      const organizationalMaturity =
        this.calculateOrganizationalMaturityFromResults(businessUnitResults);

      return {
        organisationalMaturity: organizationalMaturity,
        businessUnitMaturity: businessUnitResults,
      };
    } catch (error) {
      console.error("Error calculating digital maturity:", error);
      return {
        organisationalMaturity: this.getDefaultOrganisationalMaturity(),
        businessUnitMaturity: [],
      };
    }
  }

  async calculateBusinessUnitMaturities(businessUnits) {
    console.log("Calculating business unit maturities...");

    const businessUnitResults = [];

    const promises = businessUnits.map(
      (businessUnit) =>
        new Promise(async (resolve, reject) => {
          try {
            console.log(businessUnit.name);

            // Get users in this business unit
            const users = await this.User.find({
              organization: this.connection.user.organizationId,
              "accessPolicies.group": businessUnit._id,
            });

            console.log(
              "Users found for BU:",
              businessUnit.name,
              ":",
              users.length
            );

            if (!users.length) {
              console.log("No users found for BU:", businessUnit.name);
              businessUnitResults.push({
                businessUnit: businessUnit.name,
                businessUnitId: businessUnit._id,
                maturity: this.getDefaultModuleScores(),
                percentages: this.getDefaultPercentages(),
              });
              resolve("Analytics end");
              return;
            }

            const matchUsersData = {
              "created.by": { $in: users.map((user) => ObjectId(user._id)) },
            };

            const matchBusinessUnitData = {
              group: ObjectId(businessUnit._id),
              /**
               * match users (the users from this BU) are also added because data could also be added by super users
               * that don't belong to the unit which may result in wrong calculation.
               */
              ...matchUsersData,
            };

            const groupBusinessUnitDataByUniqueUsers = {
              _id: { user: "$created.by" },
              count: { $sum: 1 },
            };

            const groupBusinessUnitAuditByStatus = {
              _id: { status: "$completed.status" },
              count: { $sum: 1 },
            };

            const groupBusinessUnitSupplierByCompliance = {
              _id: { status: "$isCompliant" },
              count: { $sum: 1 },
            };

            // Calculate all module data
            const [
              risksByUsers,
              incidentsByUsers,
              suppliersByCompliance,
              auditsByStatus,
              documentsByUsers,
              cipsByUsers,
              hardwaresByUsers,
              softwaresByUsers,
              peoplesByUsers,
              premisesByUsers,
              informationsByUsers,
            ] = await Promise.all([
              this.Risk.aggregate([
                { $match: { ...matchBusinessUnitData } },
                { $group: { ...groupBusinessUnitDataByUniqueUsers } },
              ]),
              this.Incident.aggregate([
                { $match: { ...matchBusinessUnitData } },
                { $group: { ...groupBusinessUnitDataByUniqueUsers } },
              ]),
              this.Supplier.aggregate([
                { $match: { ...matchBusinessUnitData } },
                { $group: { ...groupBusinessUnitSupplierByCompliance } },
              ]),
              this.Audit.aggregate([
                { $match: { ...matchBusinessUnitData } },
                { $group: { ...groupBusinessUnitAuditByStatus } },
              ]),
              this.DocumentTree.aggregate([
                { $match: { ...matchUsersData, type: "document" } },
                { $group: { ...groupBusinessUnitDataByUniqueUsers } },
              ]),
              this.Cip.aggregate([
                { $match: { ...matchBusinessUnitData } },
                { $group: { ...groupBusinessUnitDataByUniqueUsers } },
              ]),
              this.HardwareAsset.aggregate([
                { $match: { ...matchBusinessUnitData } },
                { $group: { ...groupBusinessUnitDataByUniqueUsers } },
              ]),
              this.SoftwareAsset.aggregate([
                { $match: { ...matchBusinessUnitData } },
                { $group: { ...groupBusinessUnitDataByUniqueUsers } },
              ]),
              this.PeopleAsset.aggregate([
                { $match: { ...matchBusinessUnitData } },
                { $group: { ...groupBusinessUnitDataByUniqueUsers } },
              ]),
              this.PremiseAsset.aggregate([
                { $match: { ...matchBusinessUnitData } },
                { $group: { ...groupBusinessUnitDataByUniqueUsers } },
              ]),
              this.InformationAsset.aggregate([
                { $match: { ...matchBusinessUnitData } },
                { $group: { ...groupBusinessUnitDataByUniqueUsers } },
              ]),
            ]);

            // Calculate inventory (combine all asset types and get unique users)
            let inventoryByUsers = [
              ...hardwaresByUsers,
              ...softwaresByUsers,
              ...peoplesByUsers,
              ...premisesByUsers,
              ...informationsByUsers,
            ];

            const uniqueUserIdForInventory = new Set();
            inventoryByUsers = inventoryByUsers.filter((userGroup) => {
              const isDuplicate = uniqueUserIdForInventory.has(
                userGroup._id.user.toString()
              );
              uniqueUserIdForInventory.add(userGroup._id.user.toString());
              return !isDuplicate;
            });

            console.log(
              "Resultstart",
              risksByUsers,
              incidentsByUsers,
              suppliersByCompliance,
              auditsByStatus,
              documentsByUsers,
              cipsByUsers,
              hardwaresByUsers,
              softwaresByUsers,
              peoplesByUsers,
              premisesByUsers,
              informationsByUsers,
              "Resultend"
            );

            /**
             * Helpers
             */
            const _getAuditUtilizationPercentage = (auditsByStatus) => {
              const isOptimised = auditsByStatus.some(
                (result) => result._id.status
              );
              const isActive = auditsByStatus.some(
                (result) => !result._id.status
              );
              return isOptimised ? 100 : isActive ? 50 : 0;
            };

            const _getSupplierUtilizationPercentage = (
              suppliersByCompliance
            ) => {
              const isOptimised = suppliersByCompliance.some(
                (result) => result._id.status
              );
              const isActive = suppliersByCompliance.some(
                (result) => !result._id.status
              );
              return isOptimised ? 100 : isActive ? 50 : 0;
            };

            const _getModuleUtilizationPercentage = (foundUsers) =>
              parseInt((foundUsers / users.length || 0) * 100);

            /**
             * Calculate usage percentage
             */
            const riskPercentage = _getModuleUtilizationPercentage(
              risksByUsers.length
            );
            const incidentPercentage = _getModuleUtilizationPercentage(
              incidentsByUsers.length
            );
            const supplierPercentage = _getSupplierUtilizationPercentage(
              suppliersByCompliance
            );
            const auditPercentage =
              _getAuditUtilizationPercentage(auditsByStatus);
            const documentPercentage = _getModuleUtilizationPercentage(
              documentsByUsers.length
            );
            const cipPercentage = _getModuleUtilizationPercentage(
              cipsByUsers.length
            );
            const inventoryPercentage = _getModuleUtilizationPercentage(
              inventoryByUsers.length
            );

            /**
             * Calculate score (with Manual stage)
             */
            const _getScore = (percentage, foundUsers, totalUsers) => {
              if (totalUsers === 0) return 1; // Manual: No users in BU
              if (foundUsers === 0) return 2; // Digital: Users exist, no data
              if (percentage > 80) return 4; // Optimised
              if (percentage > 0) return 3; // Active
              return 2;
            };

            // For audits and suppliers, custom logic
            const _getAuditScore = (auditsByStatus, totalUsers) => {
              if (totalUsers === 0) return 1; // Manual
              if (!auditsByStatus.length) return 2; // Digital
              const isOptimised = auditsByStatus.some(
                (result) => result._id.status
              );
              const isActive = auditsByStatus.some(
                (result) => !result._id.status
              );
              if (isOptimised) return 4;
              if (isActive) return 3;
              return 2;
            };
            const _getSupplierScore = (suppliersByCompliance, totalUsers) => {
              if (totalUsers === 0) return 1; // Manual
              if (!suppliersByCompliance.length) return 2; // Digital
              const isOptimised = suppliersByCompliance.some(
                (result) => result._id.status
              );
              const isActive = suppliersByCompliance.some(
                (result) => !result._id.status
              );
              if (isOptimised) return 4;
              if (isActive) return 3;
              return 2;
            };

            // Calculate scores
            const riskScore = _getScore(
              riskPercentage,
              risksByUsers.length,
              users.length
            );
            const incidentScore = _getScore(
              incidentPercentage,
              incidentsByUsers.length,
              users.length
            );
            const documentScore = _getScore(
              documentPercentage,
              documentsByUsers.length,
              users.length
            );
            const cipScore = _getScore(
              cipPercentage,
              cipsByUsers.length,
              users.length
            );
            const inventoryScore = _getScore(
              inventoryPercentage,
              inventoryByUsers.length,
              users.length
            );
            const auditScore = _getAuditScore(auditsByStatus, users.length);
            const supplierScore = _getSupplierScore(
              suppliersByCompliance,
              users.length
            );

            // Add business unit result
            businessUnitResults.push({
              businessUnit: businessUnit.name,
              businessUnitId: businessUnit._id,
              maturity: {
                riskManagement: riskScore,
                incidentManagement: incidentScore,
                supplierManagement: supplierScore,
                documentManagement: documentScore,
                cip: cipScore,
                audits: auditScore,
                inventory: inventoryScore,
              },
              percentages: {
                riskManagement: riskPercentage,
                incidentManagement: incidentPercentage,
                supplierManagement: supplierPercentage,
                documentManagement: documentPercentage,
                cip: cipPercentage,
                audits: auditPercentage,
                inventory: inventoryPercentage,
              },
            });

            resolve("Analytics end");
          } catch (err) {
            console.log(err);
            businessUnitResults.push({
              businessUnit: businessUnit.name,
              businessUnitId: businessUnit._id,
              maturity: this.getDefaultModuleScores(),
              percentages: this.getDefaultPercentages(),
            });
            resolve("Analytics end");
          }
        })
    );

    await Promise.all(promises);
    return businessUnitResults;
  }

  calculateOrganizationalMaturityFromResults(businessUnitResults) {
    if (!businessUnitResults.length) {
      return this.getDefaultOrganisationalMaturity();
    }

    // Find the lowest score for each module across all business units
    const riskScores = businessUnitResults.map(
      (bu) => bu.maturity.riskManagement
    );
    const incidentScores = businessUnitResults.map(
      (bu) => bu.maturity.incidentManagement
    );
    const supplierScores = businessUnitResults.map(
      (bu) => bu.maturity.supplierManagement
    );
    const documentScores = businessUnitResults.map(
      (bu) => bu.maturity.documentManagement
    );
    const cipScores = businessUnitResults.map((bu) => bu.maturity.cip);
    const auditScores = businessUnitResults.map((bu) => bu.maturity.audits);
    const inventoryScores = businessUnitResults.map(
      (bu) => bu.maturity.inventory
    );

    const riskScore = Math.min(...riskScores);
    const incidentScore = Math.min(...incidentScores);
    const supplierScore = Math.min(...supplierScores);
    const auditScore = Math.min(...auditScores);
    const documentScore = Math.min(...documentScores);
    const cipScore = Math.min(...cipScores);
    const inventoryScore = Math.min(...inventoryScores);

    // Calculate percentages based on business units that have progressed beyond current org score
    const _getModuleUtilizationPercentage = (scores, currentScore) => {
      const progressedCount = scores.filter(
        (score) => score > currentScore
      ).length;
      return (
        100 -
        parseInt((progressedCount / businessUnitResults.length || 0) * 100)
      );
    };

    const riskPercentage = _getModuleUtilizationPercentage(
      riskScores,
      riskScore
    );
    const incidentPercentage = _getModuleUtilizationPercentage(
      incidentScores,
      incidentScore
    );
    const supplierPercentage = _getModuleUtilizationPercentage(
      supplierScores,
      supplierScore
    );
    const auditPercentage = _getModuleUtilizationPercentage(
      auditScores,
      auditScore
    );
    const documentPercentage = _getModuleUtilizationPercentage(
      documentScores,
      documentScore
    );
    const cipPercentage = _getModuleUtilizationPercentage(cipScores, cipScore);
    const inventoryPercentage = _getModuleUtilizationPercentage(
      inventoryScores,
      inventoryScore
    );

    return {
      riskManagement: {
        label: "Risk Management",
        points: riskScore,
        percentage: riskPercentage,
      },
      incidentManagement: {
        label: "Incident Management",
        points: incidentScore,
        percentage: incidentPercentage,
      },
      supplierManagement: {
        label: "Supplier Management",
        points: supplierScore,
        percentage: supplierPercentage,
      },
      documentManagement: {
        label: "Document Management",
        points: documentScore,
        percentage: documentPercentage,
      },
      cip: {
        label: "CIP",
        points: cipScore,
        percentage: cipPercentage,
      },
      audits: {
        label: "Audits",
        points: auditScore,
        percentage: auditPercentage,
      },
      inventory: {
        label: "Inventory",
        points: inventoryScore,
        percentage: inventoryPercentage,
      },
    };
  }

  getDefaultModuleScores() {
    return {
      riskManagement: 0,
      incidentManagement: 0,
      supplierManagement: 0,
      documentManagement: 0,
      cip: 0,
      audits: 0,
      inventory: 0,
    };
  }

  getDefaultPercentages() {
    return {
      riskManagement: 0,
      incidentManagement: 0,
      supplierManagement: 0,
      documentManagement: 0,
      cip: 0,
      audits: 0,
      inventory: 0,
    };
  }

  getDefaultOrganisationalMaturity() {
    return {
      riskManagement: {
        label: "Risk Management",
        points: 0,
        percentage: 0,
      },
      incidentManagement: {
        label: "Incident Management",
        points: 0,
        percentage: 0,
      },
      supplierManagement: {
        label: "Supplier Management",
        points: 0,
        percentage: 0,
      },
      documentManagement: {
        label: "Document Management",
        points: 0,
        percentage: 0,
      },
      cip: {
        label: "CIP",
        points: 0,
        percentage: 0,
      },
      audits: {
        label: "Audits",
        points: 0,
        percentage: 0,
      },
      inventory: {
        label: "Inventory",
        points: 0,
        percentage: 0,
      },
    };
  }
}

module.exports = { DigitalMaturityStatsService };
