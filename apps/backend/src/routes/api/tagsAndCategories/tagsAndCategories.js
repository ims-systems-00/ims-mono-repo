const router = require("express").Router();
const {
  createTagAndCategory,
  editTagAndCategory,
  getTagsAndCategories,
  getTagAndCategory,
  deleteTagAndCategory,
} = require("../../../controllers/tagsAndCategories");

// middlewares ...
const { validate } = require("../../../middleware/validator");
const validaions = require("../../../validations/tagsAndCategories");
const validateBody = validate("body");

router.post(
  "/",
  [validateBody(validaions.tagsAndCategories.createTagAndCategory)],
  createTagAndCategory
);
router.get("/", getTagsAndCategories);
router.put(
  "/:id",
  [validateBody(validaions.tagsAndCategories.updateTagAndCategory)],
  editTagAndCategory
);
router.get("/:id", getTagAndCategory);
router.delete("/:id", deleteTagAndCategory);

module.exports = router;
