const Joi = require("../../lib/validation");
const objectIdJoi = require("../../helpers/validations/customObjectIdValidator");

// give me the validation code
const validationSchema = {
  type: Joi.string().label("type"),
  attributes: Joi.object().optional().label("attributes"),
  validation: Joi.object().optional().label("validation"),
  properties: Joi.object().optional().label("properties"),
};

const createImsFormElementValidation = Joi.object({
  ...validationSchema,
  children: Joi.array()
    .items(objectIdJoi.objectId)
    .optional()
    .label("children"),
  nextFormElement: objectIdJoi.objectId.optional().label("nextFormElement"),
  previousFormElement: objectIdJoi.objectId
    .optional()
    .label("previousFormElement"),
});

const updateImsFormElementValidation = Joi.object({
  ...validationSchema,
});

const changeImsFormElementOrderValidation = Joi.object({
  newPreviousFormElement: objectIdJoi.objectId
    .optional()
    .label("previousFormElement"),
  newNextFormElement: objectIdJoi.objectId.optional().label("nextFormElement"),
});

module.exports = {
  createImsFormElementValidation,
  updateImsFormElementValidation,
  changeImsFormElementOrderValidation,
};
