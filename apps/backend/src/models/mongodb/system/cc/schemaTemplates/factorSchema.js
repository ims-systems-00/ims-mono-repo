const { CC_EMISSION_FACTOR_TYPES } = require("../ccEnum");

module.exports = {
  factorSchema: {
    factorType: {
      type: String,
      default: CC_EMISSION_FACTOR_TYPES.ACTIVITY_BASED,
      enum: Object.values(CC_EMISSION_FACTOR_TYPES),
    },
    id: {
      type: Number,
      default: -1,
    },
    year: {
      type: Number,
      default: -1,
    },
    scope: {
      type: String,
    },
    level1: {
      type: String,
      default: "",
    },
    combinedActivityReference: {
      type: String,
      default: "",
    },
    uom: {
      type: String,
      default: "",
    },
    ghgPerUnit: {
      type: String,
      default: "",
    },
    ghgConversionFactor: {
      type: Number,
      default: 0,
    },
    sicCategory: {
      type: String,
      default: "",
    },
    sic: {
      type: String,
      default: "",
    },
    sicGhgCo2ePerCurrency: {
      type: String,
      default: "",
    },
    sicGhgCo2PerCurrency: {
      type: String,
      default: "",
    },
    purchasedElectricityCoal: {
      type: Number,
      default: 0,
    },
    purchasedElectricityNaturalGas: {
      type: Number,
      default: 0,
    },
    purchasedElectricityNuclear: {
      type: Number,
      default: 0,
    },
    purchasedElectricityRenewables: {
      type: Number,
      default: 0,
    },
    purchasedElectricityOther: {
      type: Number,
      default: 0,
    },
    source: {
      type: String,
      default: "",
    },
    sourceLink: {
      type: String,
      default: "",
    },
    sourceNotes: {
      type: String,
      default: "",
    },
    neroNotes: {
      type: String,
      default: "",
    },
    grade: {
      type: String,
      default: "",
    },
    reference: {
      default: "",
      type: String,
    },
  },
};
