const Joi = require("../../lib/validation");
const { fileMetaInfo } = require("../../helpers/validations");
const objectIdJoi = require("../../helpers/validations/customObjectIdValidator");

// Base Schema
const baseSchema = {
  teamPriority: Joi.boolean().required().label("Team Priority"),
  group: objectIdJoi.objectId.label("Group"),
  assignedTo: Joi.array().items(objectIdJoi.objectId).label("Assigned To"),
  priority: Joi.string().valid("High", "Medium", "Low").label("Priority"),
  name: Joi.string().required().label("Name"),
  attachments: Joi.array().items(fileMetaInfo).label("Attachments"),
  description: Joi.string().label("Description"),
  due: Joi.date().label("Due Date"),
};

// Create Schema
const createValidation = Joi.object({
  ...baseSchema,
  moduleType: Joi.string().label("Module Type"),
  module: Joi.when("moduleType", {
    is: Joi.exist(),
    then: objectIdJoi.objectId.required().allow("").label("Module ID"),
    otherwise: Joi.forbidden(),
  }),
});

// Update Schema
const updateValidation = Joi.object({
  ...baseSchema,
  teamPriority: baseSchema.teamPriority.required(),
  name: baseSchema.name.optional(),
  group: baseSchema.group.required(),
  assignedTo: baseSchema.assignedTo.required(),
  priority: baseSchema.priority.optional(),
  attachments: baseSchema.attachments.required(),
  description: baseSchema.description.optional(),
  due: baseSchema.due.optional(),
});

module.exports = {
  createValidation,
  updateValidation,
};
