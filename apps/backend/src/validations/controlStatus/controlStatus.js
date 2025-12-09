const objectIdJoi = require("../../helpers/validations/customObjectIdValidator");
const Joi = require("../../lib/validation");

const updateControlValidation = Joi.object({
  responsibleUser: objectIdJoi.objectId.label("Responsible User").optional(),
  accountableUser: objectIdJoi.objectId.label("Accountable User").optional(),
  consultedUser: objectIdJoi.objectId.label("Consulted User").optional(),
  informedUser: objectIdJoi.objectId.label("Informed User").optional(),
});

module.exports = {
  updateControlValidation,
};