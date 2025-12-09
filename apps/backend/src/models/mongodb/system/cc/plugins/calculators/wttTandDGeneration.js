const { logger } = require("@ims-systems-00/ims-core/lib/logger");
const CCFactorsModel = require("../../ccFactors");
const {
  CC_GHG_GASSES,
  CC_CALCULATION_METHODS,
  CC_EMISSION_CATEGORY_NAMES,
  CC_EMISSION_SCOPES,
} = require("../../ccEnum");
async function calc() {
  let CCFactors = CCFactorsModel();
  try {
    if (
      [CC_EMISSION_CATEGORY_NAMES.PURCHASED_ELECTRICITY].includes(
        this.category
      )
    ) {
      let defraFactor = await CCFactors.findOne({
        year: this.emmisionFactorDbYear,
        scope: CC_EMISSION_SCOPES.SCOPE_3,
        combinedActivityReference:
          "UK electricity (generation), Electricity: UK",
        uom: this.unit,
        ghgPerUnit: CC_GHG_GASSES.CO2E,
      });
      const factor =
        defraFactor && defraFactor["ghgConversionFactor"]
          ? defraFactor["ghgConversionFactor"]
          : 0;
      if (
        [CC_CALCULATION_METHODS.LOCATION_BASED_METHOD].includes(
          this.calculationMethod
        )
      ) {
        this.wttTandDGeneration = (this.amount * factor) / 1000;
      }
      if (
        [CC_CALCULATION_METHODS.MARKET_BASED_METHOD].includes(
          this.calculationMethod
        )
      ) {
        this.wttTandDGeneration =
          ((this.amount - (this.renewables || 0)) * factor) / 1000;
      }
      this.wttTandDGeneration = this.wttTandDGeneration.toFixed(5);
    }
  } catch (err) {
    logger.error("wtt t and d generation calculation error: ", err);
  }
}
/**
 * @param {import("mongoose").Schema} schema
 */
module.exports = (schema) => {
  schema.add({
    wttTandDGeneration: {
      type: Number,
      default: null,
    },
  });
  schema.pre("save", calc);
};
