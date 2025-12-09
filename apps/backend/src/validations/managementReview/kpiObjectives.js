const Joi = require("../../lib/validation");
const {
  moduleTypes,
} = require("../../models/mongodb/schemaTemplates/utils/moduleTypes");
const objectIdJoi = require("../../helpers/validations/customObjectIdValidator");

const createValidation = Joi.object({
  value: Joi.string().required().label("value"),
  privacy: Joi.string()
    .valid("Organisational", "Business unit")
    .default("Organisational")
    .label("Privacy"),
  moduleType: Joi.string()
    .valid(...Object.values(moduleTypes))
    .required(),
  module: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
  group: objectIdJoi.objectId.optional().label("group"),
  unit: Joi.string().max(100).label("unit"),
  targetValue: Joi.number().positive().optional().messages({
    "number.base": "Target Value must be a number",
    "number.positive": "Target Value must be a positive number",
    "any.required": "Target Value is required",
  }),
});

const updateValidation = Joi.object({
  value: Joi.string().optional().label("value"),
  privacy: Joi.string()
    .valid("Organisational", "Business unit")
    .optional()
    .label("Privacy"),
  moduleType: Joi.string()
    .valid(...Object.values(moduleTypes))
    .optional(),
  module: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .optional(),
  group: objectIdJoi.objectId.optional().label("group"),
  unit: Joi.string().max(100).label("unit"),
  targetValue: Joi.number().positive().optional().messages({
    "number.base": "Target Value must be a number",
    "number.positive": "Target Value must be a positive number",
    "any.required": "Target Value is required",
  }),
  currentValue: Joi.number().optional().min(0).default(0).label("currentValue"),
});

module.exports = {
  createValidation,
  updateValidation,
};
