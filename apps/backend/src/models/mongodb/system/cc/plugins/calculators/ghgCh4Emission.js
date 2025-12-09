const { logger } = require("@ims-systems-00/ims-core/lib/logger");
const CCFactorsModel = require("../../ccFactors");
const {
  CC_GHG_GASSES,
  CC_CALCULATION_METHODS,
  CC_EMISSION_CATEGORY_NAMES,
} = require("../../ccEnum");
const { REFIRGERANT_GHG_MAPS } = require("./refrigerantMaps");
async function calc(next) {
  let CCFactors = CCFactorsModel();
  try {
    if (
      [
        CC_EMISSION_CATEGORY_NAMES.COMPANY_PREMISES,
        CC_EMISSION_CATEGORY_NAMES.COMPANY_VEHICLES,
        CC_EMISSION_CATEGORY_NAMES.PURCHASED_HEAT_AND_STEAM
      ].includes(this.category)
    ) {
      if (
        ![
          CC_CALCULATION_METHODS.CUSTOM,
          CC_CALCULATION_METHODS.MARKET_BASED_METHOD,
        ].includes(this.calculationMethod)
      ) {
        const defraFactor = await CCFactors.findOne({
          year: this.emmisionFactorDbYear,
          scope: this.scope,
          combinedActivityReference: this.activity,
          uom: this.unit,
          ghgPerUnit: CC_GHG_GASSES.CH4,
        });
        const factor =
          defraFactor && defraFactor["ghgConversionFactor"]
            ? defraFactor["ghgConversionFactor"]
            : 0;
        this.ghgCh4Emission = (this.amount * factor) / 1000;
        this.ghgCh4Emission = this.ghgCh4Emission.toFixed(5);
        return next();
      } else {
        this.ghgCh4Emission = 0;
      }
    }
    if (
      [
        CC_EMISSION_CATEGORY_NAMES.PROCESS_EMISSIONS,
        CC_EMISSION_CATEGORY_NAMES.FUGITIVE_EMISSIONS,
      ].includes(this.category) &&
      REFIRGERANT_GHG_MAPS[this.activity] === CC_GHG_GASSES.CH4
    ) {
      this.ghgCh4Emission = this.ghgCo2eEmission;
    } else this.ghgCh4Emission = 0;
  } catch (err) {
    logger.error("ghg(ch4) calculation error: ", err);
  }
}
/**
 * @param {import("mongoose").Schema} schema
 */
module.exports = (schema) => {
  schema.add({
    ghgCh4Emission: {
      type: Number,
      default: null,
    },
  });
  schema.pre("save", calc);
};
