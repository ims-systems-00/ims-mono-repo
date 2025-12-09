const router = require("express").Router();

const {
  createImsProjectWorkPackage,
  getImsProjectWorkPackage,
  listImsProjectWorkPackage,
  updateImsProjectWorkPackage,
  restoreImsProjectWorkPackage,
  softRemoveImsProjectWorkPackage,
  hardRemoveImsProjectWorkPackage,
  createImsProjectWorkPackageRelationship,
  listImsProjectWorkPackageRelationship,
  getImsProjectWorkPackageRelationship,
  hardRemoveImsProjectWorkPackageRelationship,
  createImsProjectWorkPackageAssignment,
  getImsProjectWorkPackageAssignment,
  listImsProjectWorkPackageAssignment,
  hardRemoveImsProjectWorkPackageAssignment,
  createImsProjectWorkPackageDocumentRelationship,
  listImsProjectWorkPackageDocumentRelationship,
  hardRemoveImsProjectWorkPackageDocumentRelationship,
} = require("../../../controllers/imsProject");
const {
  IMS_SERVICES,
  ACTIONS,
  EFFECTS,
} = require("@ims-systems-00/ims-core/lib/constants");
const { validate } = require("../../../middleware/validator");
const validations = require("../../../validations");
const checkTimePeriod = require("../../../middleware/checkTimePeriod");
const validateBody = validate("body");
// ims project workPackages

router.post(
  "/:projectId/workPackages/",
  [
    validateBody(validations.imsProjects.createiMSProjectWorkPackage),
    checkTimePeriod,
  ],
  createImsProjectWorkPackage
);
router.get("/:projectId/workPackages/:id", [], getImsProjectWorkPackage);
router.get("/:projectId/workPackages/", [], listImsProjectWorkPackage);
router.put(
  "/:projectId/workPackages/:id",
  [
    validateBody(validations.imsProjects.updateiMSProjectWorkPackage),
    checkTimePeriod,
  ],
  updateImsProjectWorkPackage
);
router.put(
  "/:projectId/workPackages/:id/restore",
  [],
  restoreImsProjectWorkPackage
);
router.delete(
  "/:projectId/workPackages/:id/soft",
  [],
  softRemoveImsProjectWorkPackage
);
router.delete(
  "/:projectId/workPackages/:id/hard",
  [],
  hardRemoveImsProjectWorkPackage
);

// ims project workPackage relationship
router.post(
  "/:projectId/workPackages/:id/relationships/",
  [validateBody(validations.imsProjects.createiMSProjectttWorkPackageRelation)],
  createImsProjectWorkPackageRelationship
);
router.get(
  "/:projectId/workPackages/:id/relationships/:id",
  [],
  getImsProjectWorkPackageRelationship
);
router.get(
  "/:projectId/workPackages/:id/relationships/",
  [],
  listImsProjectWorkPackageRelationship
);
router.delete(
  "/:projectId/workPackages/:id/relationships/:id/hard",
  [],
  hardRemoveImsProjectWorkPackageRelationship
);
// ims project workPackage link document
router.post(
  "/:projectId/workPackages/:id/documents/",
  [
    validateBody(
      validations.imsProjects.createImsProjectWorkPackageDocumentRelationship
    ),
  ],
  createImsProjectWorkPackageDocumentRelationship
);

router.get(
  "/:projectId/workPackages/:id/documents/",
  [],
  listImsProjectWorkPackageDocumentRelationship
);
router.delete(
  "/:projectId/workPackages/:id/documents/:id/hard",
  [],
  hardRemoveImsProjectWorkPackageDocumentRelationship
);

// ims project workPackage assignment
router.post(
  "/:projectId/workPackages/:id/assignments/",
  [
    validateBody(
      validations.imsProjects.createiMSProjectttWorkPackageAssignment
    ),
  ],
  createImsProjectWorkPackageAssignment
);
router.get(
  "/:projectId/workPackages/:id/assignments/:id",
  [],
  getImsProjectWorkPackageAssignment
);
router.get(
  "/:projectId/workPackages/:id/assignments/",
  [],
  listImsProjectWorkPackageAssignment
);
router.delete(
  "/:projectId/workPackages/:id/assignments/:id/hard",
  [],
  hardRemoveImsProjectWorkPackageAssignment
);

module.exports = router;
