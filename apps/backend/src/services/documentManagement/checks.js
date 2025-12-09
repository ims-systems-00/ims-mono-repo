const { DocumentTreeService } = require("./documenttree");
class DocumentManagementChecks {
  constructor(connection) {
    this.connection = connection;
  }
  async checkPendingApprovals(repository, parentNode, name) {
    const documetTreeService = new DocumentTreeService(this.connection);
    return documetTreeService.getNode({
      organization: this.connection.user.organizationId,
      parentNode,
      repository,
      name,
      status: "Pending",
    });
  }
  async checkDocumentOwnership(repository, parentNode, name) {
    const documetTreeService = new DocumentTreeService(this.connection);
    let result = await documetTreeService.getNode({
      organization: this.connection.user.organizationId,
      parentNode,
      repository,
      name,
    });
    return result?.created?.by === req.accessControl?.user?._id;
  }
  async checkDocumentProcessRequirements(nodeId) {
    const documetTreeService = new DocumentTreeService(this.connection);
    let result = await documetTreeService.getNode({
      organization: this.connection.user.organizationId,
      _id: nodeId,
      status: "Published",
    });
    return {
      authRequired: result?.data?.authRequired,
      signRequired: result?.data?.signRequired,
    };
  }
}
exports.DocumentManagementChecks = DocumentManagementChecks;
