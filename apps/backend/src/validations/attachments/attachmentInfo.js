const Joi = require("joi");
const {
  moduleTypes,
} = require("../../models/mongodb/schemaTemplates/utils/moduleTypes");
const { fileMetaInfo } = require("../../helpers/validations/fileMetaInfo");

const attachmentSchema = Joi.object({
  moduleType: Joi.string()
    .valid(...Object.values(moduleTypes))
    .required(),
  module: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
  fileMetaInfo: fileMetaInfo.required(),
});

module.exports = {
  attachmentSchema,
};
