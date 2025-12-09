const Joi = require("../../lib/validation");
const { fileMetaInfo } = require("../../helpers/validations");
const objectIdJoi = require("../../helpers/validations/customObjectIdValidator");

const schema = {
  tagsAndCategories: objectIdJoi.objectId.label("Tags and Categories"),
  name: Joi.string().required().label("Name"),
  owner: objectIdJoi.objectId.required().label("Owner"),
  assignedDate: Joi.date().label("Assigned Date"),
  returnDate: Joi.date().allow(null, "").label("Return Date"),
  destructionDate: Joi.date().allow(null, "").label("Destruction Date"),
  cost: Joi.number().default(0).label("Cost"),
  tag: Joi.string().label("Tag"),
};

const createHardwareValidation = Joi.object({
  ...schema,
  group: objectIdJoi.objectId.label("Group"),
});

const updateHardwareValidation = Joi.object({
  ...schema,
});

module.exports = {
  createHardwareValidation,
  updateHardwareValidation,
};
