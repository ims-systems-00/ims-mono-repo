const Joi = require("../../lib/validation");
const objectIdJoi = require("../../helpers/validations/customObjectIdValidator");

// Define Joi schema for waitingBlockingRelation
const waitingBlockingRelationSchema = Joi.object({
  blockingWorkPackage: objectIdJoi.objectId.required(),
  waitingWorkPackage: objectIdJoi.objectId.required(),
});

// Define Joi schema for the main schema
const createiMSProjectttWorkPackageRelation = Joi.object({
  waitingWorkPackage: objectIdJoi.objectId.optional(),
  childWorkPackage: objectIdJoi.objectId.optional(),
}).xor("waitingWorkPackage", "childWorkPackage");

module.exports = { createiMSProjectttWorkPackageRelation };
