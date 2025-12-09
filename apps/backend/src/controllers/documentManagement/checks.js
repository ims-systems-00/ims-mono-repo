const {
  DocumentManagementChecks,
} = require("../../services/documentManagement");
exports.checkPendingApproval = async (req, res, next) => {
  let checks = new DocumentManagementChecks(req.accessControl);
  try {
    let { id } = req.params;
    let parentNode = req.header("x-doc-parentnode");
    let fileName = req.header("x-doc-filename");
    if (!parentNode || parentNode === "null") parentNode = null;
    let result = await checks.checkPendingApprovals(id, parentNode, fileName);
    res
      .status(200)
      .json({ message: "Query execution success.", hasPending: result.status });
  } catch (err) {
    next(err)
  }
};
exports.checkDocumentOwnership = async (req, res, next) => {
  let checks = new DocumentManagementChecks(req.accessControl);
  try {
    let { id } = req.params;
    let parentNode = req.header("x-doc-parentnode");
    let fileName = req.header("x-doc-filename");
    if (!parentNode || parentNode === "null") parentNode = null;
    let result = await checks.checkDocumentOwnership(id, parentNode, fileName);
    res.status(200).json({
      message: "Query execution success.",
      hasOwnerShip: result,
    });
  } catch (err) {
    next(err)
  }
};
exports.checkDocumentProcessRequirements = async (req, res, next) => {
  let checks = new DocumentManagementChecks(req.accessControl);
  try {
    let nodeId = req.header("x-doc-nodeid");
    let result = await checks.checkDocumentProcessRequirements(nodeId);
    res.status(200).json({
      message: "Query execution success.",
      result,
    });
  } catch (err) {
    next(err);
  }
};
