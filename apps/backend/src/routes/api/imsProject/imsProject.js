const router = require("express").Router();

const {
  createImsProject,
  getImsProject,
  listImsProject,
  updateImsProject,
  restoreImsProject,
  softRemoveImsProject,
  hardRemoveImsProject,
  loadAnalytics,
  getImsProjectGantt,
  dashboard,
  createCustomField,
  deleteCustomField,
  createWorkPackageStatus,
  deleteWorkPackageStatus,
  addSection,
  addCustomFieldToSection,
  deleteSection,
  reorderSection,
  reorderCustomField,
} = require("../../../controllers/imsProject");
const {
  IMS_SERVICES,
  ACTIONS,
  EFFECTS,
} = require("@ims-systems-00/ims-core/lib/constants");
const { validate } = require("../../../middleware/validator");
const validations = require("../../../validations");
const {
  createSectionIntoProjectValidation,
} = require("../../../validations/imsProjects");
const validateBody = validate("body");
router.post(
  "/",
  [validateBody(validations.imsProjects.createiMSProject)],
  createImsProject
);
router.get("/dashboard", [], dashboard);
router.get("/:id", [], getImsProject);
router.get("/:id/gantt", [], getImsProjectGantt);
router.get("/", [], listImsProject);
router.put(
  "/:id",
  [validateBody(validations.imsProjects.updateiMSProject)],
  updateImsProject
);
router.post(
  "/:id/workpackage-status",
  [validateBody(validations.imsProjects.createWorkPackageStatusSchema)],
  createWorkPackageStatus
);
router.delete(
  "/:id/workpackage-status/:workPackageStatusId",
  [],
  deleteWorkPackageStatus
);
router.put("/:id/restore", [], restoreImsProject);
router.delete("/:id/soft", [], softRemoveImsProject);
router.delete("/:id/hard", [], hardRemoveImsProject);
router.get("/:id/overview", [], loadAnalytics);

// sections
router.post(
  "/:id/sections",
  [validateBody(validations.imsProjects.createSectionIntoProjectValidation)],
  addSection
);
router.delete("/:id/sections/:sectionId", [], deleteSection);

router.put(
  "/:id/sections/reorder",
  [validateBody(validations.imsProjects.reorderSectionSchema)],
  reorderSection
);

// custom field
router.post(
  "/:id/sections/:sectionId/custom-fields",
  [validateBody(validations.imsProjects.customFieldSchema)],
  addCustomFieldToSection
);

router.delete(
  "/:id/sections/:sectionId/custom-fields/:fieldId",
  [],
  deleteCustomField
);
router.put(
  "/:id/sections/:sectionId/custom-fields/reorder",
  [validateBody(validations.imsProjects.reorderFieldSchema)],
  reorderCustomField
);

module.exports = router;
