const { Filters } = require("../../services/utility");
const {
  DocumentTreeService,
  DocumentRepositoriesListingQuery,
} = require("../../services/documentManagement");
exports.createFolderNode = async (req, res, next) => {
  let documentTree = new DocumentTreeService(req.accessControl);
  try {
    let { id } = req.params;
    let { user } = req.accessControl;
    let data = {
      type: "folder",
      ...req.body,
      modified: {
        by: user,
        on: Date.now(),
      },
      repositoryId: id,
    };
    let node = await documentTree.createFolderNode(data);
    res
      .status(200)
      .json({ message: node.name + " added to repository.", node });
  } catch (err) {
    next(err);
  }
};
exports.addFileNodeVersion = async (req, res, next) => {
  let documentTree = new DocumentTreeService(req.accessControl);
  try {
    let { id, node_id } = req.params;
    let { user } = req.accessControl;
    let data = {
      type: "document",
      ...req.body,
      modified: {
        by: user,
        on: Date.now(),
      },
      nodeId: node_id,
      repositoryId: id,
    };
    let node = await documentTree.addFileNodeVersion(data);
    res.status(200).json({ message: "New version added.", node });
  } catch (err) {
    next(err);
  }
};
exports.createFileNode = async (req, res, next) => {
  let documentTree = new DocumentTreeService(req.accessControl);
  try {
    let { id } = req.params;
    let { user } = req.accessControl;
    let data = {
      type: "document",
      ...req.body,
      modified: {
        by: user,
        on: Date.now(),
      },
      repositoryId: id,
    };
    let nodes = await documentTree.createFileNode(data);
    res
      .status(200)
      .json({ message: "New document added to repository", nodes });
  } catch (err) {
    next(err);
  }
};
exports.addRevision = async (req, res, next) => {
  let documentTree = new DocumentTreeService(req.accessControl);
  try {
    let { node_id } = req.params;
    let { user } = req.accessControl;
    let data = {
      ...req.body.storageInfo,
      modified: {
        by: user?._id,
        on: Date.now(),
      },
    };
    let node = await documentTree.addRevision(node_id, data);
    res.status(200).json({ message: "Revision added for" + node.name, node });
  } catch (err) {
    next(err);
  }
};
exports.listRepoNodeItems = async (req, res, next) => {
  let documentTree = new DocumentTreeService(req.accessControl);
  let { page, sort, size } = req.query;
  const options = {
    page: parseInt(page),
    limit: parseInt(size),
    sort,
    collation: {
      locale: "en",
    },
  };
  let { id } = req.params;
  let filter = new Filters(req, {
    searchFields: ["reference", "name"],
  })
    .build()
    .query();
  let query = { ...filter, repository: id };
  try {
    let result = await documentTree.listNodeItemsByOrg(query, options);
    res.status(200).json({
      message: "Nodes retrived.",
      nodes: result.nodes,
      pagination: result.pagination,
    });
  } catch (err) {
    next(err);
  }
};
exports.listNodesByOrg = async (req, res, next) => {
  let documentTree = new DocumentTreeService(req.accessControl);
  let repoQueryBuilder = new DocumentRepositoriesListingQuery(
    req.accessControl
  );
  let repoQ = repoQueryBuilder.constructListingQuery({
    requestedAccessControl: { ...req.accessControl },
    requestedQuery: {},
  });
  let { page, sort, size } = req.query;
  const options = {
    page: parseInt(page),
    limit: parseInt(size),
    sort,
    collation: {
      locale: "en",
    },
  };
  let filter = new Filters(req, {
    searchFields: ["reference", "name"],
  })
    .build()
    .query();
  let query = { ...filter };
  try {
    let result = await documentTree.listNodesByOrg(
      {
        documentMatch: query,
        repositoryMatch: { ...repoQ.constructedQuery },
      },
      options
    );
    res.status(200).json({
      message: "Nodes retrived.",
      nodes: result.nodes,
      pagination: result.pagination,
    });
  } catch (err) {
    next(err);
  }
};
exports.getNode = async (req, res, next) => {
  let documentTree = new DocumentTreeService(req.accessControl);
  let { id, node_id } = req.params;
  try {
    const node = await documentTree.getNode({ _id: node_id });
    const path = await documentTree.generateNodePath(node_id);
    res.status(200).json({
      message: node.name + " information retrived.",
      node,
      path,
    });
  } catch (err) {
    next(err);
  }
};
exports.updateFolderNodeMetaData = async (req, res, next) => {
  let documentTree = new DocumentTreeService(req.accessControl);
  try {
    let data = {
      ...req.body,
      modified: {
        by: req.accessControl.user?._id,
        on: Date.now(),
      },
    };
    let node = await documentTree.updateFolderNodeMetaData(
      req.params.node_id,
      data
    );

    res.status(200).json({
      message: node.name + " updated.",
      node,
    });
  } catch (err) {
    next(err);
  }
};
exports.updateDocumentNodeMetaData = async (req, res, next) => {
  let documentTree = new DocumentTreeService(req.accessControl);
  try {
    let data = {
      ...req.body,
      modified: {
        by: req.accessControl.user?._id,
        on: Date.now(),
      },
    };
    let node = await documentTree.updateDocumentNodeMetaData(
      req.params.node_id,
      data
    );
    res.status(200).json({
      message: node.name + " updated.",
      node,
    });
  } catch (err) {
    next(err);
  }
};
exports.getNodePath = async (req, res, next) => {
  let documentTree = new DocumentTreeService(req.accessControl);
  try {
    let path = await documentTree.generateNodePath(req.params.node_id);
    res.status(200).json({
      message: "Path retrived.",
      path,
    });
  } catch (err) {
    next(err);
  }
};
exports.shareDocumentNode = async (req, res, next) => {
  let documentTree = new DocumentTreeService(req.accessControl);
  try {
    let node = await documentTree.shareDocumentNode(req.params.node_id, {
      ...req.body,
      sender: req.accessControl.user,
    });
    res.status(200).json({
      message: node.name + " is shared.",
      node,
    });
  } catch (err) {
    next(err);
  }
};
exports.getPreservedReviewers = async (req, res, next) => {
  let documentTree = new DocumentTreeService(req.accessControl);
  try {
    let reviewers = await documentTree.getPreservedReviewers(
      req.params.node_id
    );
    res.status(200).json({
      message: "Reserved reviewers retrived successfully",
      reviewers,
    });
  } catch (err) {
    next(err);
  }
};
exports.moveNode = async (req, res, next) => {
  let documentTree = new DocumentTreeService(req.accessControl);
  try {
    let node = await documentTree.moveNode(
      req.params.node_id,
      req.body.parentNode
    );
    res.status(200).json({
      message: node.name + " moved.",
      node,
    });
  } catch (err) {
    next(err);
  }
};
exports.changeRepository = async (req, res, next) => {
  let documentTree = new DocumentTreeService(req.accessControl);
  try {
    let node = await documentTree.changeRepository(
      req.params.node_id,
      req.body.repository,
      req.body.parentNode
    );
    res.status(200).json({
      message: node.name + " moved to a different repository.",
      node,
    });
  } catch (err) {
    next(err);
  }
};
exports.softDeleteNode = async (req, res, next) => {
  let documentTree = new DocumentTreeService(req.accessControl);
  try {
    let node = await documentTree.softDeleteNode(req.params.node_id);
    res.status(200).json({
      message: node.name + " moved to bin.",
      node,
    });
  } catch (err) {
    next(err);
  }
};
exports.restoreNode = async (req, res, next) => {
  let documentTree = new DocumentTreeService(req.accessControl);
  try {
    let node = await documentTree.restoreNode(req.params.node_id);
    res.status(200).json({
      message: node.name + " restored to the repository.",
      node,
    });
  } catch (err) {
    next(err);
  }
};
exports.hardDeleteNode = async (req, res, next) => {
  let documentTree = new DocumentTreeService(req.accessControl);
  try {
    let node = await documentTree.hardDeleteNode(req.params.node_id);
    res.status(200).json({
      message: node.name + " deleted.",
      node,
    });
  } catch (err) {
    next(err);
  }
};
