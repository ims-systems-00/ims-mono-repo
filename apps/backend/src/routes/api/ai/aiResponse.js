const router = require("express").Router();
const {
  createAIResponse,
  editAIResponse,
  getAIResponses,
  getAIResponse,
  removeAIResponse,
} = require("../../../controllers/ai");

// middlewares ...
const { validate } = require("../../../middleware/validator");
const validaions = require("../../../validations/ai");
const validateBody = validate("body");

router.post(
  "/responses",
  [validateBody(validaions.aiResponse.createResponse)],
  createAIResponse
);
router.get("/responses/", getAIResponses);
router.put(
  "/responses/:id",
  [validateBody(validaions.aiResponse.updateResponse)],
  editAIResponse
);
router.get("/responses/:id", getAIResponse);
router.delete("/responses/:id", removeAIResponse);

module.exports = router;
