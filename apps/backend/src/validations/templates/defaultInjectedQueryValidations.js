const Joi = require("../../lib/validation");

module.exports = {
  defaultInjectedQueryValidations: {
    page: Joi.optional(),
    size: Joi.optional(),
    sort: Joi.optional(),
  },
};
