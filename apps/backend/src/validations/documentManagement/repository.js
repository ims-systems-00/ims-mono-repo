const Joi = require("../../lib/validation");
const schema = Joi.object({
  name: Joi.string().required().label("Repository name"),
  description: Joi.string()
    .optional()
    .allow("", null)
    .label("Repository description"),
  privacy: Joi.string()
    .required()
    .valid("Organisational", "Business unit", "Only me", "Custom")
    .label("Privacy"),
  group: Joi.string().optional().allow(null).label("Business unit"),
  owners: Joi.array().min(1).max(3).required().label("Owner"),
  reviewInterval: Joi.string()
    .valid("Yearly", "Half yearly", "Quarterly")
    .optional()
    .label("Review vnterval"),
  sharedWith: Joi.array()
    .items(Joi.string().optional().label("User id"))
    .label("Shared with"),
  sourceRepoId: Joi.string().optional().label("Source RepoId"),
});
const create = schema;
const update = schema;
module.exports = {
  create,
  update,
};
