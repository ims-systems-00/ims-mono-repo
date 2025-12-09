const express = require("express");
const router = express.Router();
const validationSchemas = require("../../../../validations/index");

// auth middlewares ....
const { enforceRbac } = require("../../../../middleware/enforceRbac");
const { validate } = require("../../../../middleware/validator");

const validateBody = validate("body");
const {
  IMS_SERVICES,
  ACTIONS,
  EFFECTS,
} = require("@ims-systems-00/ims-core/lib/constants");
const {
  createFileNode,
  listRepoNodeItems,
  updateFolderNodeMetaData,
  updateDocumentNodeMetaData,
  hardDeleteNode,
  getNodePath,
  moveNode,
  changeRepository,
  addRevision,
  createFolderNode,
  softDeleteNode,
  restoreNode,
  getPreservedReviewers,
  addAuthoriser,
  handleAuthorisation,
  removeAuthoriser,
  addInternalUsersForSignature,
  addExternalUsersForSignature,
  getSignaturesOnNode,
  removeUsersForSignature,
  handleSignature,
  getNode,
  shareDocumentNode,
  addFileNodeVersion,
} = require("../../../../controllers/documentManagement");
const {
  invalidatePublicAccessToken,
} = require("../../../../middleware/invalidatePublicAccessToken");

router.post(
  "/:id/folder-nodes",
  [
    validateBody(
      validationSchemas.documentValidation.documenttree.createFolderNode
    ),
    enforceRbac({
      service: IMS_SERVICES.DOCUMENT_MANAGEMENT,
      action: ACTIONS.CREATE,
      effect: EFFECTS.ALLOW,
    }),
  ],
  createFolderNode
);

router.post(
  "/:id/file-nodes",
  [
    validateBody(
      validationSchemas.documentValidation.documenttree.createFileNode
    ),
    enforceRbac({
      service: IMS_SERVICES.DOCUMENT_MANAGEMENT,
      action: ACTIONS.CREATE,
      effect: EFFECTS.ALLOW,
    }),
  ],
  createFileNode
);
router.post(
  "/:id/nodes/:node_id/new-version",
  [
    validateBody(validationSchemas.documentValidation.documenttree.addVersion),
    enforceRbac({
      service: IMS_SERVICES.DOCUMENT_MANAGEMENT,
      action: ACTIONS.CREATE,
      effect: EFFECTS.ALLOW,
    }),
  ],
  addFileNodeVersion
);
router.get(
  "/:id/nodes",
  [
    enforceRbac({
      service: IMS_SERVICES.DOCUMENT_MANAGEMENT,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    }),
  ],
  listRepoNodeItems
);

router.get(
  "/:id/nodes/:node_id",
  [
    enforceRbac({
      service: IMS_SERVICES.DOCUMENT_MANAGEMENT,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    }),
  ],
  getNode
);

router.put(
  "/:id/folder-nodes/:node_id",
  [
    enforceRbac({
      service: IMS_SERVICES.DOCUMENT_MANAGEMENT,
      action: ACTIONS.UPDATE,
      effect: EFFECTS.ALLOW,
    }),
  ],
  updateFolderNodeMetaData
);

router.put(
  "/:id/file-nodes/:node_id",
  [
    enforceRbac({
      service: IMS_SERVICES.DOCUMENT_MANAGEMENT,
      action: ACTIONS.UPDATE,
      effect: EFFECTS.ALLOW,
    }),
  ],
  updateDocumentNodeMetaData
);

router.get(
  "/:id/nodes/:node_id/preserved-reviewers",
  [
    enforceRbac({
      service: IMS_SERVICES.DOCUMENT_MANAGEMENT,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    }),
  ],
  getPreservedReviewers
);

router.put(
  "/:id/nodes/:node_id/revision",
  [
    validateBody(validationSchemas.documentValidation.documenttree.addRevision),
    enforceRbac({
      service: IMS_SERVICES.DOCUMENT_MANAGEMENT,
      action: ACTIONS.CREATE,
      effect: EFFECTS.ALLOW,
    }),
  ],
  addRevision
);

router.get(
  "/:id/nodes/:node_id/path",
  [
    enforceRbac({
      service: IMS_SERVICES.DOCUMENT_MANAGEMENT,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    }),
  ],
  getNodePath
);

router.post(
  "/:id/nodes/:node_id/shares",
  [
    validateBody(
      validationSchemas.documentValidation.documenttree.shareFileNode
    ),
    enforceRbac({
      service: IMS_SERVICES.DOCUMENT_MANAGEMENT,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    }),
  ],
  shareDocumentNode
);

router.put(
  "/:id/nodes/:node_id/move-node",
  [
    validateBody(validationSchemas.documentValidation.documenttree.moveNode),
    enforceRbac({
      service: IMS_SERVICES.DOCUMENT_MANAGEMENT,
      action: ACTIONS.CREATE,
      effect: EFFECTS.ALLOW,
    }),
  ],
  moveNode
);

router.put(
  "/:id/nodes/:node_id/change-repository",
  [
    validateBody(
      validationSchemas.documentValidation.documenttree.changeRepository
    ),
    enforceRbac({
      service: IMS_SERVICES.DOCUMENT_MANAGEMENT,
      action: ACTIONS.CREATE,
      effect: EFFECTS.ALLOW,
    }),
  ],
  changeRepository
);
router.post(
  "/:id/nodes/:node_id/authorisation",
  [
    validateBody(
      validationSchemas.documentValidation.authorisation.addAuthoriser
    ),
    enforceRbac({
      service: IMS_SERVICES.DOCUMENT_MANAGEMENT,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    }),
  ],
  addAuthoriser
);

router.put(
  "/:id/nodes/:node_id/authorisation/:authorisation_id",
  [
    validateBody(validationSchemas.documentValidation.authorisation.status),
    enforceRbac({
      service: IMS_SERVICES.DOCUMENT_MANAGEMENT,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    }),
  ],
  handleAuthorisation
);

router.delete(
  "/:id/nodes/:node_id/authorisation/:authorisation_id",
  [
    enforceRbac({
      service: IMS_SERVICES.DOCUMENT_MANAGEMENT,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    }),
  ],
  removeAuthoriser
);

router.post(
  "/:id/nodes/:node_id/internal-signatures",
  [
    validateBody(
      validationSchemas.documentValidation.signature.addInternalSignatures
    ),
    enforceRbac({
      service: IMS_SERVICES.DOCUMENT_MANAGEMENT,
      action: ACTIONS.CREATE,
      effect: EFFECTS.ALLOW,
    }),
  ],
  addInternalUsersForSignature
);

router.post(
  "/:id/nodes/:node_id/external-signatures",
  [
    validateBody(
      validationSchemas.documentValidation.signature.addExternalSignatures
    ),
    enforceRbac({
      service: IMS_SERVICES.DOCUMENT_MANAGEMENT,
      action: ACTIONS.CREATE,
      effect: EFFECTS.ALLOW,
    }),
  ],
  addExternalUsersForSignature
);

router.get(
  "/:id/nodes/:node_id/signatures",
  [
    enforceRbac({
      service: IMS_SERVICES.DOCUMENT_MANAGEMENT,
      action: ACTIONS.READ,
      effect: EFFECTS.ALLOW,
    }),
  ],
  getSignaturesOnNode
);

router.put(
  "/:id/nodes/:node_id/signatures",
  [
    validateBody(
      validationSchemas.documentValidation.signature.removeSignatures
    ),
    enforceRbac({
      service: IMS_SERVICES.DOCUMENT_MANAGEMENT,
      action: ACTIONS.CREATE,
      effect: EFFECTS.ALLOW,
    }),
  ],
  removeUsersForSignature
);

router.put(
  "/:id/nodes/:node_id/signatures/:signature_id",
  [
    validateBody(validationSchemas.documentValidation.signature.handleStatus),
    enforceRbac({
      service: IMS_SERVICES.DOCUMENT_MANAGEMENT,
      action: ACTIONS.CREATE,
      effect: EFFECTS.ALLOW,
    }),
  ],
  handleSignature,
  invalidatePublicAccessToken
);

router.put(
  "/:id/nodes/:node_id/restore",
  [
    enforceRbac({
      service: IMS_SERVICES.DOCUMENT_MANAGEMENT,
      action: ACTIONS.CREATE,
      effect: EFFECTS.ALLOW,
    }),
  ],
  restoreNode
);
router.delete(
  "/:id/nodes/:node_id/soft",
  [
    enforceRbac({
      service: IMS_SERVICES.DOCUMENT_MANAGEMENT,
      action: ACTIONS.DELETE,
      effect: EFFECTS.ALLOW,
    }),
  ],
  softDeleteNode
);
router.delete(
  "/:id/nodes/:node_id/hard",
  [
    enforceRbac({
      service: IMS_SERVICES.DOCUMENT_MANAGEMENT,
      action: ACTIONS.DELETE,
      effect: EFFECTS.ALLOW,
    }),
  ],
  hardDeleteNode
);

module.exports = router;
