const Joi = require("../../../lib/validation");
const { evaluate } = require("../templates/evaluation");

const schema = Joi.object({
  description: Joi.string().required(),
  type: Joi.string().required(),
  startDate: Joi.date().iso().required(),
  startDayFraction: Joi.number().required(),
  endDate: Joi.date().iso().min(Joi.ref("startDate")).required(),
  endDayFraction: Joi.number().required(),
  submission: Joi.object({
    status: Joi.string().valid("Draft", "Ongoing", "Pending").required(),
  }).required(),
});

const create = schema;
const update = schema.fork(["description", "type", "submission"], (schema) =>
  schema.optional()
);

module.exports = {
  create,
  update,
  evaluate,
};
