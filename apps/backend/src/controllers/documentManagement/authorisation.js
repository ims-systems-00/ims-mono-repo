const {
  DocumentAuthFlowService,
} = require("../../services/documentManagement");

exports.addAuthoriser = async (req, res, next) => {
  let documentSignatureService = new DocumentAuthFlowService(req.accessControl);
  try {
    let node = await documentSignatureService.addAuthoriser(
      req.params.node_id,
      req.body
    );
    res.status(200).json({
      message: "Users authorisation added successfully",
      node,
    });
  } catch (err) {
    next(err)
  }
};
exports.handleAuthorisation = async (req, res, next) => {
  let documentSignatureService = new DocumentAuthFlowService(req.accessControl);
  try {
    let node = await documentSignatureService.handleAuthorisation(
      req.params.node_id,
      req.params.authorisation_id,
      req.body
    );
    res.status(200).json({
      message: "Users authorisation handled successfully",
      node,
    });
  } catch (err) {
    next(err)
  }
};
exports.removeAuthoriser = async (req, res, next) => {
  let documentSignatureService = new DocumentAuthFlowService(req.accessControl);
  try {
    let node = await documentSignatureService.removeAuthoriser(
      req.params.node_id,
      req.params.authorisation_id
    );
    res
      .status(200)
      .json({ message: "User authorisation removed sucessfully", node });
  } catch (err) {
    next(err)
  }
};
