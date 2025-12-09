const Joi = require("../../lib/validation");
const { fileMetaInfo } = require("../../helpers/validations");
const objectIdJoi = require("../../helpers/validations/customObjectIdValidator");

const baseSchema = {
  tagsAndCategories: objectIdJoi.objectId.label("Tags and Categories"),
  title: Joi.string().label("Risk Title"),
  description: Joi.string().label("Description"),
  methodOfNotification: Joi.string().allow("").label("Method of Notification"),
  priority: Joi.string()
    .valid("P1", "P2", "P3", "P4")
    .default("P3")
    .label("Priority"),
  owner: objectIdJoi.objectId.label("Owner ID"),
  affectedService: Joi.string().allow("").label("Affected Service"),
  attachments: Joi.array().items(fileMetaInfo).label("Attachments"),
  group: Joi.string().allow(null).label("Business Unit"),
  privacy: Joi.string()
    .valid("Organisational", "Business unit")
    .default("Business unit")
    .label("Privacy"),
  resolveStatus: Joi.boolean().label("Resolve Status"),
  resolution: Joi.string().allow("").label("Resolution"),
};

// Schema for creating
const createIncidentValidation = Joi.object({
  ...baseSchema,
  title: baseSchema.title.required(),
  description: baseSchema.description.required(),
});

// Schema for updating
const updateIncidentValidation = Joi.object(
  Object.fromEntries(
    Object.entries(baseSchema).map(([key, value]) => [key, value.optional()])
  )
);

module.exports = {
  createIncidentValidation,
  updateIncidentValidation,
};
