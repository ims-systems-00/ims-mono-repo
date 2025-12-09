const Joi = require("../../lib/validation");
const { fileMetaInfo } = require("../../helpers/validations");
const objectIdJoi = require("../../helpers/validations/customObjectIdValidator");

const createAuditValidation = Joi.object({
  auditor: objectIdJoi.objectId.required().label("auditor"),
  group: objectIdJoi.objectId.required().label("group"),
  complianceBody: objectIdJoi.objectId.required().label("complianceBody"),
  title: Joi.string().required().label("title"),
  focusArea: Joi.string().required().label("focusArea"),
  startDate: Joi.date().required().label("startDate"),
  time: Joi.string().optional().label("time"),
  type: Joi.string().allow("Internal", "External").label("type"),
  attachments: Joi.array().items(fileMetaInfo).label("attachments"),
  interval: Joi.string()
    .required()
    .allow("Quarterly", "Half yearly", "Yearly")
    .label("Description"),
});

const updateAuditValidation = Joi.object({
  title: Joi.string().optional().label("title"),
  group: objectIdJoi.objectId.optional().label("group"),
  complianceBody: objectIdJoi.objectId.optional().label("complianceBody"),
  startDate: Joi.date().optional().label("startDate"),
  time: Joi.string().optional().label("time"),
  comment: Joi.string().optional().allow(null, "").label("comment"),
  focusArea: Joi.string().optional().label("focusArea"),
  attachments: Joi.array().items(fileMetaInfo).label("attachments"),
});

module.exports = {
  createAuditValidation,
  updateAuditValidation,
};
