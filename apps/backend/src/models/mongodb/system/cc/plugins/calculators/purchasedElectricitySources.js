const { logger } = require("@ims-systems-00/ims-core/lib/logger");
const CCCustomFactorsModel = require("../../ccCustomFactors");
const {
  CC_GHG_GASSES,
  CC_CALCULATION_METHODS,
  CC_EMISSION_CATEGORY_NAMES,
  CC_EMISSION_SCOPES,
} = require("../../ccEnum");
async function calc() {
  let CCCustomFactors = CCCustomFactorsModel();
  try {
    if (
      [CC_EMISSION_CATEGORY_NAMES.PURCHASED_ELECTRICITY].includes(this.category)
    ) {
      if (
        [CC_CALCULATION_METHODS.LOCATION_BASED_METHOD].includes(
          this.calculationMethod
        )
      ) {
        this.purchasedElectricityCoal = 0;
        this.purchasedElectricityNaturalGas = 0;
        this.purchasedElectricityNuclear = 0;
        this.purchasedElectricityRenewables = 0;
        this.purchasedElectricityOther = 0;
      }
      if (
        [CC_CALCULATION_METHODS.MARKET_BASED_METHOD].includes(
          this.calculationMethod
        )
      ) {
        let customFactor = await CCCustomFactors.findOne({
          // combinedActivityReference: this.activity,
          // uom: this.unit,
          // ghgPerUnit: CC_GHG_GASSES.CO2E,
          _id: this.customFactorId,
        });
        this.purchasedElectricityCoal =
          customFactor && customFactor["purchasedElectricityCoal"]
            ? customFactor["purchasedElectricityCoal"]
            : 0;
        this.purchasedElectricityNaturalGas =
          customFactor && customFactor["purchasedElectricityNaturalGas"]
            ? customFactor["purchasedElectricityNaturalGas"]
            : 0;
        this.purchasedElectricityNuclear =
          customFactor && customFactor["purchasedElectricityNuclear"]
            ? customFactor["purchasedElectricityNuclear"]
            : 0;
        this.purchasedElectricityRenewables =
          customFactor && customFactor["purchasedElectricityRenewables"]
            ? customFactor["purchasedElectricityRenewables"]
            : 0;
        this.purchasedElectricityOther =
          customFactor && customFactor["purchasedElectricityOther"]
            ? customFactor["purchasedElectricityOther"]
            : 0;
      }
    }
  } catch (err) {
    logger.error("purchased electricity sources calculation error: ", err);
  }
}
/**
 * @param {import("mongoose").Schema} schema
 */
module.exports = (schema) => {
  schema.add({
    purchasedElectricityCoal: {
      type: Number,
      default: null,
    },
    purchasedElectricityNaturalGas: {
      type: Number,
      default: null,
    },
    purchasedElectricityNuclear: {
      type: Number,
      default: null,
    },
    purchasedElectricityRenewables: {
      type: Number,
      default: null,
    },
    purchasedElectricityOther: {
      type: Number,
      default: null,
    },
  });
  schema.pre("save", calc);
};
