const Joi = require("../../../lib/validation");
const { evaluate } = require('../templates/evaluation')

const schema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().allow('', null),
  currency: Joi.string(),
});
const create = schema;
const update = schema.fork(
  ["title"],
  (schema) => schema.optional()
);
module.exports = { create, update, evaluate }
