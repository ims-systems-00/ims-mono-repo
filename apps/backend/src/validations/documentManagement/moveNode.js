const Joi = require("../../lib/validation");
const schema = Joi.object({
  parentNode: Joi.string().allow(null),
})
  .required()
  .label("node details");
const moveNode = schema;
module.exports = {
  moveNode,
};
