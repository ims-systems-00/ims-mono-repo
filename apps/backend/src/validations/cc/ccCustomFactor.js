const Joi = require("../../lib/validation");
const objectIdJoi = require("../../helpers/validations/customObjectIdValidator");
const {
  CC_EMISSION_FACTOR_TYPES,
  CC_EMISSION_CATEGORY_NAMES,
  CC_DATA_QUALITY_GRADES,
} = require("../../models/mongodb/system/cc/ccEnum");

const factorSchema = {
  factorType: Joi.string()
    .label("Factor Type")
    .valid(...Object.values(CC_EMISSION_FACTOR_TYPES))
    .default(CC_EMISSION_FACTOR_TYPES.ACTIVITY_BASED),
  id: Joi.number().label("ID"),
  year: Joi.number().label("Year"),
  scope: Joi.string().label("Scope"),
  level1: Joi.string().default("").label("Level 1"),
  combinedActivityReference: Joi.string()
    .default("")
    .label("Combined Activity Reference"),
  uom: Joi.string().label("UOM").default(""),
  ghgPerUnit: Joi.string().default("").label("GHG Per Unit"),
  ghgConversionFactor: Joi.number().label("GHG Conversion Factor").default(0),
  sicCategory: Joi.string().label("SIC Category").default(""),
  sic: Joi.string().label("SIC").default(""),
  sicGhgCo2ePerCurrency: Joi.string()
    .label("SIC GHG CO2e Per Currency")
    .default(""),
  sicGhgCo2PerCurrency: Joi.string()
    .label("SIC GHG CO2 Per Currency")
    .default(""),
  source: Joi.string().label("Source").default(""),
  sourceLink: Joi.string().allow("").label("Source Link").default(""),
  sourceNotes: Joi.string().allow("").label("Source Notes").default(""),
  neroNotes: Joi.string().allow("").label("Nero Notes").default(""),
  grade: Joi.string()
    .valid(...Object.values(CC_DATA_QUALITY_GRADES))
    .label("Grade")
    .default(""),
  purchasedElectricityCoal: Joi.number()
    .default(0)
    .label("Purchased Electricity Coal"),
  purchasedElectricityNaturalGas: Joi.number()
    .default(0)
    .label("Purchased Electricity Natural Gas"),
  purchasedElectricityNuclear: Joi.number()
    .default(0)
    .label("Purchased Electricity Nuclear"),
  purchasedElectricityRenewables: Joi.number()
    .default(0)
    .label("Purchased Electricity Renewables"),
  purchasedElectricityOther: Joi.number()
    .default(0)
    .label("Purchased Electricity Other"),
};

const createCcCustomFactorValidation = Joi.object({
  category: Joi.string()
    .label("Category")
    .valid(...Object.values(CC_EMISSION_CATEGORY_NAMES))
    .required(),
  ...factorSchema,
}).label("Create CC Custom Factor Validation");

const updateCcCustomFactorValidation = Joi.object({
  category: Joi.string()
    .valid(...Object.values(CC_EMISSION_CATEGORY_NAMES))
    .optional()
    .label("Category"),
  ...factorSchema,
}).label("Update CC Custom Factor Validation");

module.exports = {
  createCcCustomFactorValidation,
  updateCcCustomFactorValidation,
};
