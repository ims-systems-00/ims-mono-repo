const Joi = require("../../../lib/validation");

const schema = Joi.object({
  decision: Joi.string().valid("Approved", "Rejected").required(),
});

module.exports = {
  evaluate: schema,
};
