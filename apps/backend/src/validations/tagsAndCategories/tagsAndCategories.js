const Joi = require("joi");
const template = Joi.object({
  applicableModules: Joi.array().max(20).label("applicableModules"),
  name: Joi.string().required().label("name"),
  description: Joi.string().optional().allow(null, "").label("description"),
});

const createTagAndCategory = template;
const updateTagAndCategory = template.fork(["applicableModules"], (schema) =>
  schema.optional()
);
module.exports = {
  createTagAndCategory,
  updateTagAndCategory,
};
