const { models } = require("../../models");
const {
  DocumentRepositoryService,
} = require("../../services/documentManagement/repository");

class Manager {
  constructor(connection) {
    this.connection = connection;
    this.ImsProject = models.imsProjects(connection);
    this.ImsProjectMemberShip = models.imsProjectMemberShips(connection);
    this.ImsProjectWorkPackage = models.imsProjectWorkPackages(connection);
    this.ImsProjectBudget = models.imsProjectBudgets(connection);
    this.ImsProjectWorkPackageRelationship =
      models.imsProjectWorkPackegeRelationships(connection);
    this.ImsProjectWorkPackageAssignment =
      models.imsProjectWorkPackageAssignments(connection);
    this.ImsProjectWorkPackageDocumentRelationship =
      models.imsProjectWorkPackageDocumentRelationships(connection);
    this.ImsProjectReport = models.imsProjectReports(connection);
    this.ImsProjectEmailSchedule = models.imsProjectEmailSchedules(connection);
    this.ImsProjectMaterial = models.imsProjectMaterials(connection);
    this.User = models.users(connection);
    this.Organisation = models.organizations(connection);
    this.DocumentRepository = models.documentrepositories(connection);
    this.DocumentTree = models.documenttrees(connection);
    this.DocumentRepositoryService = new DocumentRepositoryService(connection);
  }
}
module.exports = { Manager };
