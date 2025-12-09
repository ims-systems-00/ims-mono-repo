const Joi = require("joi");
const objectIdJoi = require("../../helpers/validations/customObjectIdValidator");

// give me common validations for ims forms

const validationSchema = {
  title: Joi.string().min(1).max(255).required().label("title"),
  description: Joi.string().max(1000).optional().label("description"),
  // theme: Joi.string().optional().label("theme"),
};

const createImsFormValidation = Joi.object({
  ...validationSchema,
});

const updateImsFormValidation = Joi.object({
  title: Joi.string().min(1).max(255).label("title"),
  description: Joi.string().max(1000).optional().label("description"),
  submissionCount: Joi.number().min(0).optional(),
  collaboration: Joi.array().items(objectIdJoi.objectId).optional(),
  status: Joi.string().valid("draft", "published", "archived").default("draft"),
  themeForegroundColour: Joi.string().label("themeForegroundColour"),
  themeBackgroundColour: Joi.string().label("themeBackgroundColour"),
});

module.exports = {
  createImsFormValidation,
  updateImsFormValidation,
};
