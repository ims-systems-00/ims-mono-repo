const Joi = require("../../lib/validation");

module.exports = Joi.object({
  Name: Joi.string().required(),
  ETag: Joi.optional(),
  VersionId: Joi.optional(),
  Location: Joi.optional(),
  key: Joi.optional(),
  Key: Joi.string().required(),
  Bucket: Joi.string().required(),
});
