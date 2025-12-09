const {
  DocumentTreeService,
  DocumentRepositoryService,
  DocumentRepositoriesListingQuery,
} = require("../../services/documentManagement");
exports.createDocumentRepository = async (req, res, next) => {
  let documentRepositoyService = new DocumentRepositoryService(
    req.accessControl
  );
  try {
    let data = {
      ...req.body,
      createdBy: req.accessControl?.user?._id,
    };
    let repository = await documentRepositoyService.createRepository(data, {
      sourceRepoId: req.body.sourceRepoId || null,
    });
    res
      .status(200)
      .json({ message: "Repository created successfully", repository });
  } catch (err) {
    next(err);
  }
};
exports.respositoryQueryConstructor = (req, res, next) => {
  const repoQueryBuilder = new DocumentRepositoriesListingQuery(
    req.accessControl
  );
  let result = repoQueryBuilder.constructListingQuery({
    requestedAccessControl: { ...req.accessControl },
    requestedQuery: { ...req.query },
  });
  req.dbQuery = result.constructedQuery;
  req.query = result.requestedQuery;
  return next();
};
exports.getDocumentRepositoris = async (req, res, next) => {
  let documentRepositoyService = new DocumentRepositoryService(
    req.accessControl
  );
  try {
    let { page, sort, size } = req.query;
    const options = { page: parseInt(page), limit: parseInt(size), sort };
    let query = req.dbQuery;
    let result = await documentRepositoyService.getRepositoriesByOrg(
      query,
      options
    );
    res.status(200).json({
      message: "Repositories retrived successfully",
      repositories: result.repositories,
      pagination: result.pagination,
    });
  } catch (err) {
    next(err);
  }
};
exports.updateDocumentRepository = async (req, res, next) => {
  let documentRepositoyService = new DocumentRepositoryService(
    req.accessControl
  );
  try {
    let updatedRepository = await documentRepositoyService.updateRepository(
      req.params.id,
      { ...req.body, createdBy: req.accessControl?.user?._id }
    );
    res.status(200).json({
      message: "Repository updated successfully.",
      repository: updatedRepository,
    });
  } catch (err) {
    next(err);
  }
};
exports.getDocumentRepository = async (req, res, next) => {
  let documentRepositoyService = new DocumentRepositoryService(
    req.accessControl
  );
  let documentTreeService = new DocumentTreeService(req.accessControl);
  try {
    let { id } = req.params;
    let repository = await documentRepositoyService.getRepository({ _id: id });
    let totalDocumentNodes = await documentTreeService.countNodes({
      repository: id,
      "deleteMarker.status": false,
      status: "Published",
      type: "document",
    });
    res.status(200).json({
      message: "Repository information retrived successfully",
      repository,
      totalDocumentNodes,
    });
  } catch (err) {
    next(err);
  }
};
exports.softDeleteDocumentRepository = async (req, res, next) => {
  let documentRepositoyService = new DocumentRepositoryService(
    req.accessControl
  );
  try {
    let { id } = req.params;
    let repository = await documentRepositoyService.softDeleteRepository(id);
    res.status(200).json({ message: "Repository moved to bin", repository });
  } catch (err) {
    next(err);
  }
};
exports.hardDeleteDocumentRepository = async (req, res, next) => {
  let documentRepositoyService = new DocumentRepositoryService(
    req.accessControl
  );
  try {
    let { id } = req.params;
    let repository = await documentRepositoyService.hardDeleteRepository(id);
    res.status(200).json({ message: "Repository will be deleted", id });
  } catch (err) {
    next(err);
  }
};
exports.restoreDocumentRepository = async (req, res, next) => {
  let documentRepositoyService = new DocumentRepositoryService(
    req.accessControl
  );
  try {
    let { id } = req.params;
    let repository = await documentRepositoyService.restoreRepository(id);
    res
      .status(200)
      .json({ message: "Repository restored successfully", repository });
  } catch (err) {
    next(err);
  }
};
