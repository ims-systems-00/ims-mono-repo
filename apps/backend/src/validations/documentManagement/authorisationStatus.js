const Joi = require("../../lib/validation");
const schema = Joi.object({
  status: Joi.string().required().valid("Approved", "Rejected").label("Status"),
  message: Joi.string().required().label("Message"),
}).label("signature status");
module.exports = {
  status: schema,
};
