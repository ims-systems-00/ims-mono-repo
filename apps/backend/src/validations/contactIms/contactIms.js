const Joi = require("joi");

const commonTemplate = {
  name: Joi.string().max(20).required().label("Name"),
  email: Joi.string().max(50).email().required().label("Email"),
  jobTitle: Joi.string().required().label("Job Title"),
  phone: Joi.string().required().label("Phone"),
  organisationName: Joi.string().required().label("Organisation Name"),
};

const bookDateSchema = Joi.object({
  ...commonTemplate,
  additionalInformation: Joi.string()
    .allow("")
    .optional()
    .label("Additional Information"),
  bookedDate: Joi.string().required().label("Booked Date"),
});

const getStartedSchema = Joi.object({
  ...commonTemplate,
  service: Joi.string().required().label("Service"),
  iso27001: Joi.boolean().required().label("ISO 27001"),
  iso27002: Joi.boolean().required().label("ISO 27002"),
  iso20000: Joi.boolean().required().label("ISO 20000"),
  iso45001: Joi.boolean().required().label("ISO 45001"),
  iso9001: Joi.boolean().required().label("ISO 9001"),
  iso14001: Joi.boolean().required().label("ISO 14001"),
  iso22301: Joi.boolean().required().label("ISO 22301"),
});

module.exports = {
  bookDateSchema,
  getStartedSchema,
};