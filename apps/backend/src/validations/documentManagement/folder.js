const Joi = require("../../lib/validation");
const schema = Joi.object({
  name: Joi.string().required(),
  parentNode: Joi.string().required().allow(null),
  data: Joi.object({}).label("folder details"),
})
  .required()
  .label("node details");
const createFolderNode = schema;
module.exports = {
  createFolderNode,
};
