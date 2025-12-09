const Joi = require("../../../lib/validation");

const schema = Joi.object({
  type: Joi.string().required().label("Type"),
  location: Joi.string().optional().allow("", null).label("Location"),
  priorities: Joi.string().optional().allow("", null).label("Priorities"),
  achievements: Joi.string().optional().allow("", null).label("Achievements"),
});

const create = schema;
const update = schema.fork(["type", "location"], (schema) => schema.optional());
module.exports = {
  create,
  update,
};
