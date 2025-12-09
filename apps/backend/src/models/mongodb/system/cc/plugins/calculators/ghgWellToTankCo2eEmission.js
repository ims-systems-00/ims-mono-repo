const { logger } = require("@ims-systems-00/ims-core/lib/logger");
const CCFactorsModel = require("../../ccFactors");
const {
  CC_GHG_GASSES,
  CC_CALCULATION_METHODS,
  CC_EMISSION_CATEGORY_NAMES,
  CC_EMISSION_SCOPES,
} = require("../../ccEnum");
async function calc(next) {
  let CCFactors = CCFactorsModel();
  try {
    if (
      [
        CC_EMISSION_CATEGORY_NAMES.COMPANY_PREMISES,
        CC_EMISSION_CATEGORY_NAMES.COMPANY_VEHICLES,
        CC_EMISSION_CATEGORY_NAMES.UPSTREAM_TRANSPORTATION_AND_DISTRIBUTION,
        CC_EMISSION_CATEGORY_NAMES.BUSINESS_TRAVEL,
        CC_EMISSION_CATEGORY_NAMES.EMPLOYEE_COMMUTING,
        CC_EMISSION_CATEGORY_NAMES.DOWNSTREAM_TRANSPORTATION_AND_DISTRIBUTION,
      ].includes(this.category) &&
      [
        CC_CALCULATION_METHODS.CUSTOM,
        CC_CALCULATION_METHODS.SPEND_BASED_METHOD,
      ].includes(this.calculationMethod)
    ) {
      this.ghgWellToTankCo2eEmission = 0;
      return next();
    }
    if (
      [
        CC_EMISSION_CATEGORY_NAMES.PROCESS_EMISSIONS,
        CC_EMISSION_CATEGORY_NAMES.FUGITIVE_EMISSIONS,
      ].includes(this.category)
    ) {
      this.ghgWellToTankCo2eEmission = 0;
      return next();
    }
    let defraFactorQuery = { combinedActivityReference: this.activity };
    if (
      [
        CC_EMISSION_CATEGORY_NAMES.COMPANY_PREMISES,
        CC_EMISSION_CATEGORY_NAMES.COMPANY_VEHICLES,
        CC_EMISSION_CATEGORY_NAMES.UPSTREAM_TRANSPORTATION_AND_DISTRIBUTION,
        CC_EMISSION_CATEGORY_NAMES.BUSINESS_TRAVEL,
        CC_EMISSION_CATEGORY_NAMES.EMPLOYEE_COMMUTING,
        CC_EMISSION_CATEGORY_NAMES.DOWNSTREAM_TRANSPORTATION_AND_DISTRIBUTION,
      ].includes(this.category)
    ) {
      if (
        this.calculationMethod === CC_CALCULATION_METHODS.FUEL_BASED_METHOD
      ) {
        // query remain unchanged
      }
      if (
        [
          CC_EMISSION_CATEGORY_NAMES.COMPANY_VEHICLES,
          CC_EMISSION_CATEGORY_NAMES.UPSTREAM_TRANSPORTATION_AND_DISTRIBUTION,
          CC_EMISSION_CATEGORY_NAMES.BUSINESS_TRAVEL,
          CC_EMISSION_CATEGORY_NAMES.EMPLOYEE_COMMUTING,
          CC_EMISSION_CATEGORY_NAMES.DOWNSTREAM_TRANSPORTATION_AND_DISTRIBUTION,
        ].includes(this.category) &&
        [
          CC_CALCULATION_METHODS.DISTANCE_BASED_METHOD,
          CC_CALCULATION_METHODS.DISTANCE_BASED_VEHICLES_METHOD,
          CC_CALCULATION_METHODS.DISTANCE_BASED_PUBLIC_TRANSPORT_METHOD,
          CC_CALCULATION_METHODS.MASS_DISTANCE_BASED_METHOD,
        ].includes(this.calculationMethod)
      ) {
        defraFactorQuery = {
          ...defraFactorQuery,
          combinedActivityReference: "WTT- " + this.activity,
        };
        if (
          [
            CC_EMISSION_CATEGORY_NAMES.UPSTREAM_TRANSPORTATION_AND_DISTRIBUTION,
            CC_EMISSION_CATEGORY_NAMES.DOWNSTREAM_TRANSPORTATION_AND_DISTRIBUTION,
          ].includes(this.category)
        ) {
          defraFactorQuery = {
            ...defraFactorQuery,
            level1: "WTT- delivery vehs & freight",
          };
        }
      }
      defraFactorQuery = {
        ...defraFactorQuery,
        year: this.emmisionFactorDbYear,
        scope: CC_EMISSION_SCOPES.SCOPE_3,
        uom: this.unit,
        ghgPerUnit: CC_GHG_GASSES.CO2E,
      };
      const defraFactor = await CCFactors.findOne(defraFactorQuery);
      const factor =
        defraFactor && defraFactor["ghgConversionFactor"]
          ? defraFactor["ghgConversionFactor"]
          : 0;
      this.ghgWellToTankCo2eEmission = (this.amount * factor) / 1000;
      this.ghgWellToTankCo2eEmission =
        this.ghgWellToTankCo2eEmission.toFixed(5);
      return next();
    }
    if (
      [CC_EMISSION_CATEGORY_NAMES.PURCHASED_ELECTRICITY].includes(
        this.category
      )
    ) {
      let wttTAndD = this.wttTAndD || 0;
      let wttTandDGeneration = this.wttTandDGeneration || 0;
      let tAndDLosses = this.tAndDLosses || 0;
      this.ghgWellToTankCo2eEmission =
        wttTAndD + wttTandDGeneration + tAndDLosses;
      return next();
    }
  } catch (err) {
    logger.error("ghg(n2o) calculation error: ", err);
  }
}
/**
 * @param {import("mongoose").Schema} schema
 */
module.exports = (schema) => {
  schema.add({
    ghgWellToTankCo2eEmission: {
      type: Number,
      default: null,
    },
  });
  schema.pre("save", calc);
};
