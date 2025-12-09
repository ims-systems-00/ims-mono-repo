const Joi = require("joi");

const analyserTemplate = {
  dataDisplay: Joi.string().required().label("dataDisplay"),
  context: Joi.string().required().label("context"),
  reportStructure: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().required().label("context"),
        description: Joi.string().optional().allow("", null).label("context"),
        prompt: Joi.string().required().label("context"),
        response: Joi.string().optional().allow("", null).label("context"),
      })
    )
    .label("reportStructure"),
};

const responseStructure = Joi.object({
  moduleType: Joi.string().required().label("moduleType"),
  module: Joi.string().required().label("module"),
  template: Joi.object(analyserTemplate).required().label("template"),
});
const updateResponse = responseStructure.fork(
  ["moduleType", "module"],
  (schema) => schema.optional()
);
module.exports = {
  createResponse: responseStructure,
  updateResponse: updateResponse,
};
