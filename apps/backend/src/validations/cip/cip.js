const Joi = require("../../lib/validation");
const { fileMetaInfo } = require("../../helpers/validations");
const objectIdJoi = require("../../helpers/validations/customObjectIdValidator");
const {
  moduleTypes,
} = require("../../models/mongodb/schemaTemplates/utils/moduleTypes");

const baseSchema = {
  title: Joi.string().label("Risk Title"),
  owner: objectIdJoi.objectId.label("Owner ID"),
  cost: Joi.number().label("Cost"),
  opportunityForImprovement: Joi.string().label("Opportunity for Improvement"),
  attachments: Joi.array().items(fileMetaInfo).label("Attachments"),
  group: Joi.string().allow(null).label("Business Unit"),
  moduleType: Joi.string()
    .valid(
      moduleTypes.tasks,
      moduleTypes.risks,
      moduleTypes.incidents,
      moduleTypes.audits,
      moduleTypes.cips,
      moduleTypes.customers,
      moduleTypes.documenttrees,
      moduleTypes.expensereports,
      moduleTypes.managementreviews,
      moduleTypes.kpiobjectives,
      moduleTypes.suppliers,
      moduleTypes.imsprojects,
      moduleTypes.imsprojectworkpackages
    )
    .label("Module Type"),
  module: Joi.when("moduleType", {
    is: Joi.exist(),
    then: objectIdJoi.objectId.required().allow("").label("Module ID"),
    otherwise: Joi.forbidden(),
  }),
};

// Schema for creating
const createValidation = Joi.object({
  ...baseSchema,
  title: baseSchema.title.required(),
  opportunityForImprovement: baseSchema.opportunityForImprovement.required(),
});

// Schema for updating
const updateValidation = Joi.object(
  Object.fromEntries(
    Object.entries(baseSchema).map(([key, value]) => [key, value.optional()])
  )
);

module.exports = {
  createValidation,
  updateValidation,
};
