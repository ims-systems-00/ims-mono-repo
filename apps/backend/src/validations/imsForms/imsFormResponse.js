const Joi = require("../../lib/validation");
const objectIdJoi = require("../../helpers/validations/customObjectIdValidator");

const schema = {
  responses: Joi.array().required().label("responses"),
};
const createImsFormResponseValidation = Joi.object({ ...schema });

const updteImsFormResponseValidation = Joi.object({
  ...schema,
});

module.exports = {
  createImsFormResponseValidation,
  updteImsFormResponseValidation,
};
