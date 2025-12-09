const Joi = require("../../lib/validation");
const { fileMetaInfo } = require("../../helpers/validations");
const objectIdJoi = require("../../helpers/validations/customObjectIdValidator");

const schema = {
  tagsAndCategories: objectIdJoi.objectId.label("Tags and Categories"),
  name: Joi.string().required().label("Name"),
  numberOfLicenses: Joi.number().label("Number of Licenses"),
  numberOfInstalls: Joi.number().label("Number of Installs"),
  cost: Joi.number().label("Cost"),
  docs: Joi.array().items(fileMetaInfo).label("Docs"),
};

const createSoftwareValidation = Joi.object({
  ...schema,
  group: objectIdJoi.objectId.label("Group"),
  keys: Joi.array()
    .items(
      Joi.object({
        value: Joi.string().label("Key Value"),
      })
    )
    .label("Keys"),
});

const updateSoftwareValidation = Joi.object({
  ...schema,
});

module.exports = {
  createSoftwareValidation,
  updateSoftwareValidation,
};
