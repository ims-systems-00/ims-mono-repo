const Joi = require("joi");
const {
  ROLES,
} = require("../../models/mongodb/schemaTemplates/references/typesAndEnums");
const emailTemplate = Joi.string().max(50).email().label("Email");
const createInvitation = Joi.object({
  role: Joi.string()
    .valid(...Object.values(ROLES))
    .label("Role"),
  email: emailTemplate,
});
module.exports = {
  createInvitation,
};
