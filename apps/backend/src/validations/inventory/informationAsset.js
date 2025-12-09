const Joi = require("../../lib/validation");
const { fileMetaInfo } = require("../../helpers/validations");
const objectIdJoi = require("../../helpers/validations/customObjectIdValidator");

const schema = {
  tagsAndCategories: objectIdJoi.objectId.label("Tags and Categories"),
  informationInventory: Joi.string().label("Information Inventory"),
  title: Joi.string().required().label("Title"),
  owner: objectIdJoi.objectId.label("Owner"),
  storageLocation: Joi.string().label("Storage Location"),
  format: Joi.string().label("Format"),
  link: Joi.string().label("Link"),
  cost: Joi.number().label("Cost"),
};

const createInformationValidation = Joi.object({
  ...schema,
  group: objectIdJoi.objectId.label("Group"),
});

const updateInformationValidation = Joi.object({
  ...schema,
});

module.exports = {
  createInformationValidation,
  updateInformationValidation,
};
