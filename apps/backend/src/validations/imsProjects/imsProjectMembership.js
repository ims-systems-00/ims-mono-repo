const Joi = require("../../lib/validation");
const objectIdJoi = require("../../helpers/validations/customObjectIdValidator");

const schema = {
  role: Joi.string()
    .valid("Project Manager", "Project Member")
    .required()
    .label("role"),
  raci: Joi.string()
    .optional()
    .allow("", null)
    .valid("R", "A", "C", "I")
    .label("raci"),
  title: Joi.string().optional().allow("", null).label("title"),
  responsibility: Joi.string()
    .optional()
    .allow("", null)
    .label("responsibility"),
};

const createiMSProjectMembership = Joi.object({
  ...schema,
  imsProjectId: objectIdJoi.objectId.label("imsProjectId"),
  userId: objectIdJoi.objectId.label("user Id"),
});

const updateiMSProjectMembership = Joi.object({
  ...schema,
});

module.exports = {
  createiMSProjectMembership,
  updateiMSProjectMembership,
};
