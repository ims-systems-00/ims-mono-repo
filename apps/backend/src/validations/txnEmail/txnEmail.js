const Joi = require("joi");
const emailTemplate = Joi.string().max(50).email().required().label("Email");
const createtxnEmail = Joi.object({
  email: emailTemplate,
});

module.exports = {
  createtxnEmail,
};
