const Joi = require("../../lib/validation");
const schema = Joi.object({
  user: Joi.string().required().label("User"),
}).label("signature status");
module.exports = {
  addAuthoriser: schema,
};
