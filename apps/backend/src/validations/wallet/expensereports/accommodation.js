const Joi = require("../../../lib/validation");
const attachmentValidation = require("../../templates/attachments");

const schema = Joi.object({
  notes: Joi.string().allow('', null),
  location: Joi.string().allow('', null),
  type: Joi.string().allow('', null),
  checkin: Joi.string().allow('', null),
  checkout: Joi.string().allow('', null),
  cost: Joi.number(),
  attachments: Joi.array().items(attachmentValidation),
});

const create = schema;
const update = schema;
module.exports = { create, update }
