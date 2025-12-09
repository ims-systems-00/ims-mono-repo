const Joi = require("../../lib/validation");
const attachmentValidation = require("../templates/attachments");
const schema = Joi.object({
  storageInfo: attachmentValidation,
})
  .required()
  .label("revision details");
const addRevision = schema;
module.exports = {
  addRevision,
};
