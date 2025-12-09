const Joi = require("../../lib/validation");
const attachmentValidation = require("../templates/attachments");
const schema = Joi.object({
  profileImageInfo: attachmentValidation,
});
const changeProfileImage = schema;
const changeSignature = Joi.object({
  signatureInfo: attachmentValidation,
});
module.exports = {
  changeProfileImage,
  changeSignature,
};
