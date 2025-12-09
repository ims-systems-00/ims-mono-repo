const Joi = require("../../lib/validation");
const schema = Joi.object({
  parentNode: Joi.string().required().allow(null),
  repository: Joi.string().required().label("repository"),
})
  .required()
  .label("node details");
const changeRepository = schema;
module.exports = {
  changeRepository,
};
