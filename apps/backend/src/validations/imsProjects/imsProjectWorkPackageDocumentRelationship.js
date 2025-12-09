const Joi = require("../../lib/validation");
const objectIdJoi = require("../../helpers/validations/customObjectIdValidator");

// Define Joi schema for the main schema
const createImsProjectWorkPackageDocumentRelationship = Joi.object({
  linkedDocument: objectIdJoi.objectId.required(),
});

module.exports = { createImsProjectWorkPackageDocumentRelationship };
