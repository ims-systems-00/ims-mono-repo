const Joi = require("joi");
const objectIdJoi = require("../../helpers/validations/customObjectIdValidator");
const { fileMetaInfo } = require("../../helpers/validations/fileMetaInfo");

const ccCarbonReductionInitiativeSchema = {
  title: Joi.string().required().trim().min(1).max(255).label("title"),
  description: Joi.string().trim().default("").label("description"),
  implementedAt: Joi.date()
    .optional()
    .allow(null)
    .max(Date.now())
    .label("implementedAt"),
  identifiedAt: Joi.date()
    .optional()
    .allow(null)
    .max(Date.now())
    .label("identifiedAt"),
  priority: Joi.string()
    .valid(...["Low", "Medium", "High", "Critical"])
    .default("Medium")
    .label("priority"),
    potentialCoBenefits: Joi.string().optional().label("potentialCoBenefits"),
    potentialUnintendedConsequences: Joi.string().optional().label("potentialUnintendedConsequences"),
};

const createReductionPlanInitative = Joi.object({
  attachments: Joi.array().items(fileMetaInfo).allow(null).label("Attachments"),
  assignedTo: Joi.array()
    .items(Joi.string().hex().length(24))
    .label("assignedTo"),
  ...ccCarbonReductionInitiativeSchema,
});

const updateReductionPlanInitative = Joi.object({
  ...ccCarbonReductionInitiativeSchema,
});

module.exports = {
  createReductionPlanInitative,
  updateReductionPlanInitative,
};
