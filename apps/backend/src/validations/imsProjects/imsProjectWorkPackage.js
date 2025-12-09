const Joi = require("joi");
const objectIdJoi = require("../../helpers/validations/customObjectIdValidator");

const createiMSProjectWorkPackage = Joi.object({
  title: Joi.string().required().min(3).label("title"),
  description: Joi.string()
    .optional()
    .allow("")
    .allow(null)
    .max(28000)
    .label("description"),
  startDate: Joi.date().required().label("startDate"),
  endDate: Joi.date().min(Joi.ref("startDate")).required().label("endDate"),
  groupColorHex: Joi.string().optional().label("groupColorHex"),
  imsProjectId: objectIdJoi.objectId.label("imsProjectId"),
  progressPercentage: Joi.number().min(0).max(100).optional().default(0),
  type: Joi.string()
    .valid("Task", "Milestone", "Task Group")
    .required()
    .default("Task"),
  groupWorkPackage: objectIdJoi.objectId.optional().label("groupWorkPackage"),
  status: Joi.string()
    .optional()
    .valid("Pending", "In Progress", "Completed")
    .default("Pending"),
  priority: Joi.string()
    .valid("Critical", "High", "Medium", "Low")
    .optional()
    .default("Medium"),
});

const updateiMSProjectWorkPackage = Joi.object({
  title: Joi.string().optional().min(3).label("title"),
  description: Joi.string()
    .optional()
    .allow("")
    .allow(null)
    .max(28000)
    .label("description"),
  startDate: Joi.date().optional().label("startDate"),
  endDate: Joi.date().optional().label("endDate"),
  progressPercentage: Joi.number().min(0).max(100).optional().default(0),
  groupColorHex: Joi.string().optional().label("groupColorHex"),
  type: Joi.string()
    .valid("Task", "Milestone", "Task Group")
    .optional()
    .default("Task"),
  priority: Joi.string()
    .valid("Critical", "High", "Medium", "Low")
    .optional()
    .default("Medium"),
  groupWorkPackage: objectIdJoi.objectId.optional().label("groupWorkPackage"),
  status: Joi.string()
    .valid("Pending", "In Progress", "Completed")
    .default("Pending"),
});

module.exports = {
  createiMSProjectWorkPackage,
  updateiMSProjectWorkPackage,
};
