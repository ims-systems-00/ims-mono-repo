const router = require("express").Router();
const {
  createAttachment,
  getAttachment,
  listAttachment,
  softRemoveAttachment,
  hardRemoveAttachment,
  restoreAttachment,
} = require("../../../controllers/attachment");
const { validate } = require("../../../middleware/validator");
const validations = require("../../../validations/attachments");
const validateBody = validate("body");
router.post(
  "/",
  [validateBody(validations.attachmentSchema)],
  createAttachment
);

router.get("/:id", [], getAttachment);
router.get("/", [], listAttachment);

router.delete("/:id/soft", [], softRemoveAttachment);
router.delete("/:id/hard", [], hardRemoveAttachment);

router.put("/:id/restore", [], restoreAttachment);

module.exports = router;
