const { trimQuery } = require("../../validations/utils");
const { Filters } = require("../../services/utility");
const {
  DocumentSignatureService,
} = require("../../services/documentManagement");
const { RegistrationService } = require("../../services/account");
const url = require("url");
exports.addInternalUsersForSignature = async (req, res, next) => {
  let documentSignatureService = new DocumentSignatureService(
    req.accessControl
  );
  try {
    documentSignatureService.addInternalUsersForSignatre({
      accessControl: req.accessControl,
      repository: req.params.id,
      node: req.params.node_id,
      requestedBy: req.accessControl.user,
      ...req.body,
    });
    res
      .status(200)
      .json({ message: "We will notify you once the users are added." });
  } catch (err) {
    next(err);
  }
};
exports.addExternalUsersForSignature = async (req, res, next) => {
  let documentSignatureService = new DocumentSignatureService(
    req.accessControl
  );
  try {
    documentSignatureService.addExternalUsersForSignatre({
      accessControl: req.accessControl,
      repository: req.params.id,
      node: req.params.node_id,
      requestedBy: req.accessControl.user,
      ...req.body,
    });
    res
      .status(200)
      .json({ message: "We will notify you once the users are added." });
  } catch (err) {
    next(err);
  }
};
exports.resendInternalSignature = async (req, res, next) => {
  let documentSignatureService = new DocumentSignatureService(
    req.accessControl
  );
  try {
    documentSignatureService.resendInternalSignature({
      accessControl: req.accessControl,
      signatureIds: req.body.signatureIds,
      requestedBy: req.accessControl.user,
    });
    res
      .status(200)
      .json({ message: "We will notify you once the users are added." });
  } catch (err) {
    next(err);
  }
};
exports.resendExternalSignature = async (req, res, next) => {
  let documentSignatureService = new DocumentSignatureService(
    req.accessControl
  );
  try {
    documentSignatureService.resendExternalSignature({
      accessControl: req.accessControl,
      signatureIds: req.body.signatureIds,
      requestedBy: req.accessControl.user,
    });
    res
      .status(200)
      .json({ message: "We will notify you once the users are added." });
  } catch (err) {
    next(err);
  }
};
exports.getSignaturesOnNode = async (req, res, next) => {
  let documentSignatureService = new DocumentSignatureService(
    req.accessControl
  );
  let { page, sort, size } = trimQuery(req.query);
  const options = { page, limit: size, sort };
  let filter = new Filters(req, { searchFields: ["reference"] })
    .build()
    .query();
  let query = {
    ...filter,
    repository: req.params.id,
    node: req.params.node_id,
  };
  try {
    result = await documentSignatureService.getSignaturesByOrg(query, options);
    res.status(200).json({
      message: "User signatures retrived successfully",
      pagination: result.pagination,
      usersForSignature: result.usersForSignature,
    });
  } catch (err) {
    next(err);
  }
};
exports.getSignaturesByOrg = async (req, res, next) => {
  let documentSignatureService = new DocumentSignatureService(
    req.accessControl
  );
  let { page, sort, size } = trimQuery(req.query);
  const options = { page, limit: size, sort };
  let filter = new Filters(req, { searchFields: ["reference", "message"] })
    .build()
    .query();
  let query = {
    ...filter,
  };
  try {
    result = await documentSignatureService.getSignaturesByOrg(query, options);
    res.status(200).json({
      message: "User signatures retrived successfully",
      pagination: result.pagination,
      usersForSignature: result.usersForSignature,
    });
  } catch (err) {
    next(err);
  }
};
exports.getSignature = async (req, res, next) => {
  let documentSignatureService = new DocumentSignatureService(
    req.accessControl
  );
  try {
    let { type, respository, document, user } = req.query;
    let userSignature = await documentSignatureService.getSignature({
      type,
      respository,
      document,
      user,
    });
    res.status(200).json({
      message: "Users review retrived successfully",
      userSignature,
    });
  } catch (err) {
    next(err);
  }
};
exports.handleSignature = async (req, res, next) => {
  let documentSignatureService = new DocumentSignatureService(
    req.accessControl
  );
  try {
    let userSignature = await documentSignatureService.handleSignature(
      req.params.signature_id,
      req.body
    );
    res.status(200).json({
      message: "Users review handled successfully",
      userSignature,
    });
  } catch (err) {
    next(err);
  }
  next();
};
exports.removeUsersForSignature = async (req, res, next) => {
  let documentSignatureService = new DocumentSignatureService(
    req.accessControl
  );
  try {
    let { signatures } = req.body;
    documentSignatureService.removeUsersForSignature({
      _id: { $in: signatures },
    });
    res.status(200).json({ message: "Users removed sucessfully" });
  } catch (err) {
    next(err);
  }
};
exports.authSignaturePermissision = async (req, res, next) => {
  let documentSignatureService = new DocumentSignatureService(
    req.accessControl
  );
  let registrationService = new RegistrationService(req.accessControl);
  const signPermissionToken = req.header("x-signpermission-token");
  try {
    let response = await documentSignatureService.authSignaturePermissision(
      signPermissionToken
    );
    const newUrl = req.originalUrl.split("/public");
    req.url = newUrl[1];
    let limitedAccessToken = await registrationService.getLimitedAccessToken();
    res.redirect(
      url.format({
        pathname: newUrl[1],
        query: {
          limitedAccessToken,
        },
      })
    );
  } catch (err) {
    next(err);
  }
};
