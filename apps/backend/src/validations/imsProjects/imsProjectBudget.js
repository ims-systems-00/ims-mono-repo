const Joi = require("../../lib/validation");
const objectIdJoi = require("../../helpers/validations/customObjectIdValidator");

const schema = {
  title: Joi.string().required().label("title"),
  unitPrice: Joi.number().required().label("unit price"),
  quantity: Joi.number().default(1).optional().label("quantity"),
  currency: Joi.string().optional().default("GBP").label("currency"),
  description: Joi.string().optional().default("").label("description"),
};

const createiMSProjectBudget = Joi.object({
  ...schema,
  imsProjectId: objectIdJoi.objectId.label("imsProjectId"),
});

const updateiMSProjectBudget = Joi.object({
  ...schema,
});

module.exports = {
  createiMSProjectBudget,
  updateiMSProjectBudget,
};
