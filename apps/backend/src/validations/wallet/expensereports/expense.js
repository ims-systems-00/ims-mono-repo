const Joi = require("../../../lib/validation");
const attachmentValidation = require("../../templates/attachments");

const schema = Joi.object({
  description: Joi.string().required(),
  type: Joi.string().required(),
  cost: Joi.number(),
  attachments: Joi.array().items(attachmentValidation),
});

const create = schema;
const update = schema.fork(['type', 'description'], (schema) => schema.optional());
module.exports = { create, update }
