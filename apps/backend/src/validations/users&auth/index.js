const Joi = require("../../lib/validation");
const schema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
});
const create = schema;
const update = schema;
const addLocaion = Joi.object({
  type: Joi.string().required().valid("Remote", "On-site"),
  address: Joi.string().required(),
});
module.exports = {
  create,
  update,
  addLocaion,
  ...require("./profileImage"),
};
