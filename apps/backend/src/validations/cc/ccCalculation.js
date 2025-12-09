const Joi = require("../../lib/validation");
const objectIdJoi = require("../../helpers/validations/customObjectIdValidator");
const {
  CC_DATA_QUALITY_GRADES,
  CC_EMISSION_CATEGORY_NAMES,
  CC_EMISSION_SCOPES,
  CC_EMISSION_SCOPE_NAMES,
  CC_ALLOWED_NET_ZERO_REPORTING_YEARS,
  CC_CALCULATION_METHODS,
} = require("../../models/mongodb/system/cc/ccEnum");
const {
  MONTHS,
} = require("../../models/mongodb/schemaTemplates/references/typesAndEnums");

const createCcCalculation = Joi.object({
  scope: Joi.string()
    .required()
    .valid(...Object.values(CC_EMISSION_SCOPES))
    .label("scope"),
  scopeName: Joi.string()
    .required()
    .valid(...Object.values(CC_EMISSION_SCOPE_NAMES))
    .label("Scope name"),
  category: Joi.string()
    .required()
    .valid(...Object.values(CC_EMISSION_CATEGORY_NAMES))
    .label("category"),
  reportingYear: Joi.number()
    .valid(...Object.values(CC_ALLOWED_NET_ZERO_REPORTING_YEARS))
    .required()
    .label("reporting year"),
  reportingMonth: Joi.string()
    .valid("Annual", ...Object.values(MONTHS))
    .required()
    .label("reporting month"),
  calculationMethod: Joi.string().required().label("calculationMethod"),
  activity: Joi.string()
    .when("calculationMethod", {
      is: Joi.valid(
        CC_CALCULATION_METHODS.CUSTOM,
        CC_CALCULATION_METHODS.SUPPLIER_SPECIFIC_METHOD,
        CC_CALCULATION_METHODS.MARKET_BASED_METHOD
      ),
      then: Joi.optional().allow(null, ""),
      otherwise: Joi.required(),
    })
    .label("activity"),
  unit: Joi.string()
    .when("calculationMethod", {
      is: Joi.valid(
        CC_CALCULATION_METHODS.CUSTOM,
        CC_CALCULATION_METHODS.SUPPLIER_SPECIFIC_METHOD,
        CC_CALCULATION_METHODS.MARKET_BASED_METHOD
      ),
      then: Joi.optional().allow(null, ""),
      otherwise: Joi.required(),
    })
    .label("unit"),
  meterNumber: Joi.string()
    .allow("")
    .optional()
    .default("")
    .label("meterNumber"),
  supplierName: Joi.string()
    .allow("")
    .optional()
    .default("")
    .label("supplierName"),
  invoiceNumber: Joi.string()
    .allow("")
    .optional()
    .default("")
    .label("invoiceNumber"),
  amount: Joi.number().required().default(0).label("amount"),
  activityDataGrade: Joi.string()
    .required()
    .valid(...Object.values(CC_DATA_QUALITY_GRADES))
    .label("activityDataGrade"),
  customFactorId: Joi.string()
    .when("calculationMethod", {
      is: Joi.valid(
        CC_CALCULATION_METHODS.CUSTOM,
        CC_CALCULATION_METHODS.SUPPLIER_SPECIFIC_METHOD,
        CC_CALCULATION_METHODS.MARKET_BASED_METHOD
      ),
      then: Joi.required(),
      otherwise: Joi.optional().allow(null, ""),
    })
    .label("unit"),
  customReference: Joi.string()
    .optional()
    .allow(null, "")
    .label("customReference"),
  location: objectIdJoi.objectId.optional().label("location"),
});

const updateCcCalculation = Joi.object({
  scope: Joi.string()
    .optional()
    .valid(...Object.values(CC_EMISSION_SCOPES))
    .label("scope"),
  scopeName: Joi.string()
    .optional()
    .valid(...Object.values(CC_EMISSION_SCOPE_NAMES))
    .label("Scope name"),
  category: Joi.string()
    .optional()
    .valid(...Object.values(CC_EMISSION_CATEGORY_NAMES))
    .label("category"),
  reportingYear: Joi.number()
    .valid(...Object.values(CC_ALLOWED_NET_ZERO_REPORTING_YEARS))
    .optional()
    .label("reporting year"),
  reportingMonth: Joi.string()
    .valid("Annual", ...Object.values(MONTHS))
    .optional()
    .label("reporting month"),
  calculationMethod: Joi.string().optional().label("calculationMethod"),
  activity: Joi.string()
    .when("calculationMethod", {
      is: Joi.valid(
        CC_CALCULATION_METHODS.CUSTOM,
        CC_CALCULATION_METHODS.SUPPLIER_SPECIFIC_METHOD,
        CC_CALCULATION_METHODS.MARKET_BASED_METHOD
      ),
      then: Joi.optional().allow(null, ""),
      otherwise: Joi.optional(),
    })
    .label("activity"),
  unit: Joi.string()
    .when("calculationMethod", {
      is: Joi.valid(
        CC_CALCULATION_METHODS.CUSTOM,
        CC_CALCULATION_METHODS.SUPPLIER_SPECIFIC_METHOD,
        CC_CALCULATION_METHODS.MARKET_BASED_METHOD
      ),
      then: Joi.optional().allow(null, ""),
      otherwise: Joi.optional(),
    })
    .label("unit"),
  meterNumber: Joi.string()
    .allow("")
    .optional()
    .default("")
    .label("meterNumber"),
  supplierName: Joi.string()
    .allow("")
    .optional()
    .default("")
    .label("supplierName"),
  invoiceNumber: Joi.string()
    .allow("")
    .optional()
    .default("")
    .label("invoiceNumber"),
  amount: Joi.number().optional().default(0).label("amount"),
  location: objectIdJoi.objectId.optional().label("location"),
  activityDataGrade: Joi.string()
    .optional()
    .valid(...Object.values(CC_DATA_QUALITY_GRADES))
    .label("activityDataGrade"),
  customFactorId: Joi.string().optional().allow(null).label("customFactorId"),
  customReference: Joi.string()
    .optional()
    .allow(null, "")
    .label("customReference"),
});

module.exports = {
  createCcCalculation,
  updateCcCalculation,
};
