const Joi = require("joi");
const {
  CC_REPORTING_METHODS,
  CC_ORGANISATIONAL_BOUNDARIES,
  CC_ALLOWED_NET_ZERO_TARGET_YEARS,
  CC_ALLOWED_NET_ZERO_REPORTING_YEARS,
  CC_RELEVANCE,
} = require("../../models/mongodb/system/cc/ccEnum");

const createCcParameter = Joi.object({
  reportingStartDate: Joi.date()
    .min("2019-01-01")
    .max("now")
    .required()
    .label("Reporting Start Date"),
  baseReportingYear: Joi.number()
    .valid(...CC_ALLOWED_NET_ZERO_REPORTING_YEARS)
    .required()
    .label("Base Reporting Year"),
  currentReportingYear: Joi.number()
    .valid(...CC_ALLOWED_NET_ZERO_REPORTING_YEARS)
    .min(Joi.ref("baseReportingYear"))
    .required()
    .label("Current Reporting Year"),
  primaryReportingMethod: Joi.string()
    .valid(...Object.values(CC_REPORTING_METHODS))
    .required()
    .label("Primary Reporting Method"),
  organisationalBoundary: Joi.string()
    .valid(...Object.values(CC_ORGANISATIONAL_BOUNDARIES))
    .required()
    .label("Organisational Boundary"),
  netZeroTargtYear: Joi.number()
    .valid(...CC_ALLOWED_NET_ZERO_TARGET_YEARS)
    .min(Joi.ref("baseReportingYear"))
    .required()
    .label("Net Zero Target Year"),
  netZeroReductionPercentageAmbition: Joi.number()
    .min(1)
    .max(100)
    .required()
    .label("Net Zero Reduction Percentage Ambition"),
});

const updateCcParameter = Joi.object({
  reportingStartDate: Joi.date()
    .min("2019-01-01")
    .optional()
    .label("Reporting Start Date"),
  baseReportingYear: Joi.number()
    .valid(...CC_ALLOWED_NET_ZERO_REPORTING_YEARS)
    .optional()
    .label("Base Reporting Year"),
  currentReportingYear: Joi.number()
    .valid(...CC_ALLOWED_NET_ZERO_REPORTING_YEARS)
    .min(Joi.ref("baseReportingYear"))
    .optional()
    .label("Current Reporting Year"),
  primaryReportingMethod: Joi.string()
    .valid(...Object.values(CC_REPORTING_METHODS))
    .optional()
    .label("Primary Reporting Method"),
  organisationalBoundary: Joi.string()
    .valid(...Object.values(CC_ORGANISATIONAL_BOUNDARIES))
    .optional()
    .label("Organisational Boundary"),
  netZeroTargtYear: Joi.number()
    .valid(...CC_ALLOWED_NET_ZERO_TARGET_YEARS)
    .min(Joi.ref("baseReportingYear"))
    .optional()
    .label("Net Zero Target Year"),
  netZeroReductionPercentageAmbition: Joi.number()
    .min(1)
    .max(100)
    .optional()
    .label("Net Zero Reduction Percentage Ambition"),
});

const updateCcParameterReportingYear = Joi.object({
  turnOver: Joi.number().default(0).optional().label("Turn Over"),
  employeeCount: Joi.number().default(0).optional().label("Employee Count"),
});

const updateCcParameterReportingBoundary = Joi.object({
  relevance: Joi.string()
    .required()
    .valid(...Object.values(CC_RELEVANCE))
    .label("Relevance"),
});

module.exports = {
  createCcParameter,
  updateCcParameter,
  updateCcParameterReportingYear,
  updateCcParameterReportingBoundary,
};
