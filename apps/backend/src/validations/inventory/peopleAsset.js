const Joi = require("../../lib/validation");
const { fileMetaInfo } = require("../../helpers/validations");
const objectIdJoi = require("../../helpers/validations/customObjectIdValidator");

const schema = {
  tagsAndCategories: objectIdJoi.objectId.label("Tags and Categories"),
  name: Joi.string().required().label("Name"),
  role: Joi.string().required().label("Role"),
  responsibility: Joi.string().label("Responsibility"),
  skill: Joi.string().required().label("Skill"),
};

const createPeopleValidation = Joi.object({
  ...schema,
  group: objectIdJoi.objectId.label("Group"),
});

const updatePeopleValidation = Joi.object({
  ...schema,
});

module.exports = {
  createPeopleValidation,
  updatePeopleValidation,
};
