const objectIdJoi = require("../../helpers/validations/customObjectIdValidator");
const Joi = require("../../lib/validation");
const {
  moduleTypes,
} = require("../../models/mongodb/schemaTemplates/utils/moduleTypes");

const baseSchema = {
  type: Joi.string()
    .valid(
      "Hardware",
      "Software",
      "People",
      "Premise",
      "Organisational",
      "Clinical"
    )
    .label("Type"),
  group: Joi.string().allow(null).label("Business unit"),
  tagsAndCategories: Joi.string().allow(null).label("Tags and categories"),
  asset: Joi.string().allow(null).label("Business unit"),
  title: Joi.string().label("Risk title"),
  description: Joi.string().label("Description"),
  consequence: Joi.number().label("Consequence").default(1),
  likelihood: Joi.number().label("Likelihood").default(1),
  owner: Joi.string().label("Business unit"),
  controlsAndMitigation: Joi.any().label("Controls and mitigation"),
  mitigationStatus: Joi.boolean().label("Mitigation Status"),
  acceptanceRational: Joi.any().label("Acceptance Rational"),
  decisionMaker: Joi.any().label("Decision maker"),
  acceptanceStatus: Joi.boolean().label("Acceptance Status"),
  attachments: Joi.array().label("Attachments"),
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
    then: objectIdJoi.objectId.allow("").label("Module ID"),
    otherwise: Joi.forbidden(),
  }),
};

// Schema for creating
const create = Joi.object({
  ...baseSchema,
  type: baseSchema.type.required(),
  title: baseSchema.title.required(),
  description: baseSchema.description.required(),
});

// Schema for updating
const update = Joi.object(
  Object.fromEntries(
    Object.entries(baseSchema).map(([key, value]) => [key, value.optional()])
  )
);

module.exports = {
  create,
  update,
};
