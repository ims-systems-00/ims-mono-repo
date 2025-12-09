const Joi = require("../../../lib/validation");
const attachmentValidation = require("../../templates/attachments");

const schema = Joi.object({
  notes: Joi.string().allow('', null),
  type: Joi.string().valid("One way", "Round trip"),
  cost: Joi.number(),
  transport: Joi.string().valid("Car", "Air", "Public transport"),
  from: Joi.string().allow('', null),
  to: Joi.string().allow('', null),
  distance: Joi.number(),
  attachments: Joi.array().items(attachmentValidation),
});

exports.create = schema;
exports.update = schema;
