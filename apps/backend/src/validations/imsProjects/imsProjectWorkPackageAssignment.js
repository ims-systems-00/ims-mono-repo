const Joi = require("../../lib/validation");
const objectIdJoi = require("../../helpers/validations/customObjectIdValidator");

const createiMSProjectttWorkPackageAssignment = Joi.object({
  imsProjectWorkPackage: objectIdJoi.objectId.label("imsProjectWorkPackage"),
  assignedTo: Joi.array()
    .items(Joi.string())
    .max(25)
    .required()
    .label("assignedTo"),
  imsProjectId: objectIdJoi.objectId.label("imsProjectId"),
});

module.exports = {
  createiMSProjectttWorkPackageAssignment,
};
