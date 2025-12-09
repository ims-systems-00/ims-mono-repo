const router = require("express").Router();
const {
  generateConversationResponse,
  generateNormalResponse,
} = require("../../../controllers/ai");

// middlewares ...
const { validate } = require("../../../middleware/validator");
const validaions = require("../../../validations/ai");
const validateBody = validate("body");

router.post(
  "/gpt-stream",
  [validateBody(validaions.conversation.query)],
  generateConversationResponse
);
router.post(
  "/gpt-normal",
  [validateBody(validaions.conversation.query)],
  generateNormalResponse
);

module.exports = router;
