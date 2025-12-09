const Joi = require("../../lib/validation");
const { fileMetaInfo } = require("../../helpers/validations");
const objectIdJoi = require("../../helpers/validations/customObjectIdValidator");

const schema = {
  tagsAndCategories: objectIdJoi.objectId.label("Tags and Categories"),
  name: Joi.string().required().label("Name"),
  location: Joi.string().required().label("Location"),
  address: Joi.string().required().label("Address"),
  cost: Joi.number().default(0).label("Cost"),
};

const createPremiseValidation = Joi.object({
  ...schema,
  group: objectIdJoi.objectId.label("Group"),
});

const updatePremiseValidation = Joi.object({
  ...schema,
});

module.exports = {
  createPremiseValidation,
  updatePremiseValidation,
};
