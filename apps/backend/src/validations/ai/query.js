const Joi = require("joi");

const gptInputStructureValidation = Joi.object({
  role: Joi.string().valid("system", "assistant", "user").label("role"),
  content: Joi.string().optional().label("content"),
});

const query = Joi.object({
  prompt: Joi.string().required().label("Prompt"),
  systemInstructions: Joi.array()
    .items(gptInputStructureValidation)
    .required()
    .label("Conversation"),
  conversation: Joi.array()
    .required()
    .items(gptInputStructureValidation)
    .label("Conversation"),
});
module.exports = {
  query,
};
