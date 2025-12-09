const { logger } = require("@ims-systems-00/ims-core/lib/logger");
const CCFactorsModel = require("../../ccFactors");
const {
  CC_GHG_GASSES,
  CC_CALCULATION_METHODS,
  CC_EMISSION_CATEGORY_NAMES,
  CC_MISC,
  CC_EMISSION_SCOPES,
} = require("../../ccEnum");
async function calc(next) {
  let CCFactors = CCFactorsModel();
  try {
    if (
      [
        CC_EMISSION_CATEGORY_NAMES.COMPANY_PREMISES,
        CC_EMISSION_CATEGORY_NAMES.PURCHASED_ELECTRICITY,
        CC_EMISSION_CATEGORY_NAMES.COMPANY_VEHICLES,
        CC_EMISSION_CATEGORY_NAMES.UPSTREAM_TRANSPORTATION_AND_DISTRIBUTION,
        CC_EMISSION_CATEGORY_NAMES.BUSINESS_TRAVEL,
        CC_EMISSION_CATEGORY_NAMES.EMPLOYEE_COMMUTING,
        CC_EMISSION_CATEGORY_NAMES.DOWNSTREAM_TRANSPORTATION_AND_DISTRIBUTION,
      ].includes(this.category) &&
      [
        CC_CALCULATION_METHODS.CUSTOM,
        CC_CALCULATION_METHODS.MARKET_BASED_METHOD,
      ].includes(this.calculationMethod)
    ) {
      this.ghgBiogenicCo2Emission = 0;
      return next();
    }
    if (
      [
        CC_EMISSION_CATEGORY_NAMES.PROCESS_EMISSIONS,
        CC_EMISSION_CATEGORY_NAMES.FUGITIVE_EMISSIONS,
      ].includes(this.category)
    ) {
      this.ghgBiogenicCo2Emission = 0;
      return next();
    }
    if (
      [
        CC_EMISSION_CATEGORY_NAMES.COMPANY_PREMISES,
        CC_EMISSION_CATEGORY_NAMES.COMPANY_VEHICLES,
        CC_EMISSION_CATEGORY_NAMES.PURCHASED_ELECTRICITY,
        CC_EMISSION_CATEGORY_NAMES.UPSTREAM_TRANSPORTATION_AND_DISTRIBUTION,
        CC_EMISSION_CATEGORY_NAMES.BUSINESS_TRAVEL,
        CC_EMISSION_CATEGORY_NAMES.EMPLOYEE_COMMUTING,
        CC_EMISSION_CATEGORY_NAMES.DOWNSTREAM_TRANSPORTATION_AND_DISTRIBUTION,
      ].includes(this.category) &&
      [
        CC_CALCULATION_METHODS.FUEL_BASED_METHOD,
        CC_CALCULATION_METHODS.DISTANCE_BASED_METHOD,
      ].includes(this.calculationMethod)
    ) {
      let defraFactorQuery = {
        year: this.emmisionFactorDbYear,
        uom: this.unit,
        ghgPerUnit: CC_GHG_GASSES.CO2,
        combinedActivityReference: this.activity,
        scope: CC_MISC.OUTSIDE_OF_SCOPES,
      };
      const defraFactor = await CCFactors.findOne(defraFactorQuery);
      const factor =
        defraFactor && defraFactor["ghgConversionFactor"]
          ? defraFactor["ghgConversionFactor"]
          : 0;
      this.ghgBiogenicCo2Emission = (this.amount * factor) / 1000;
      this.ghgBiogenicCo2Emission = this.ghgBiogenicCo2Emission.toFixed(5);
      return next();
    }
    this.ghgBiogenicCo2Emission = 0;
  } catch (err) {
    logger.error("ghg(biogenic co2) calculation error: ", err);
  }
}
/**
 * @param {import("mongoose").Schema} schema
 */
module.exports = (schema) => {
  schema.add({
    ghgBiogenicCo2Emission: {
      type: Number,
      default: null,
    },
  });
  schema.pre("save", calc);
};
