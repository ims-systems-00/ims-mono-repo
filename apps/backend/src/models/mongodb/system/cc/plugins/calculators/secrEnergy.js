const { logger } = require("@ims-systems-00/ims-core/lib/logger");
const {
  CC_EMISSION_CATEGORY_NAMES,
  CC_CALCULATION_METHODS,
  CC_UNITS,
  CC_EMISSION_SCOPES,
  CC_GHG_GASSES,
} = require("../../ccEnum");
const CCFactorsModel = require("../../ccFactors");
async function calc() {
  let CCFactors = CCFactorsModel();
  try {
    if ([CC_EMISSION_CATEGORY_NAMES.COMPANY_PREMISES].includes(this.category)) {
      if (this.unit === CC_UNITS.TONNES) {
        let defraFactor = await CCFactors.findOne({
          year: 2023, // only 2023 records are found in the excell
          combinedActivityReference: this.activity,
          uom: CC_UNITS.KWH_PER_KG_NET_CV,
        });
        const factor =
          defraFactor && defraFactor["ghgConversionFactor"]
            ? defraFactor["ghgConversionFactor"]
            : 0;
        this.secrEnergy = this.amount * 1000 * factor;
        this.secrEnergy = this.secrEnergy.toFixed(5);
      }
      if (this.unit === CC_UNITS.KG) {
        let defraFactor = await CCFactors.findOne({
          year: 2023, // only 2023 records are found in the excell
          combinedActivityReference: this.activity,
          uom: CC_UNITS.KWH_PER_KG_NET_CV,
        });
        const factor =
          defraFactor && defraFactor["ghgConversionFactor"]
            ? defraFactor["ghgConversionFactor"]
            : 0;
        this.secrEnergy = this.amount * factor;
        this.secrEnergy = this.secrEnergy.toFixed(5);
      }
      if (this.unit === CC_UNITS.GJ) {
        let defraFactor = await CCFactors.findOne({
          year: 2023, // only 2023 records are found in the excell
          combinedActivityReference: this.activity,
          uom: CC_UNITS.GJ_PER_TONNE_NET_CV,
        });
        const factor =
          defraFactor && defraFactor["ghgConversionFactor"]
            ? defraFactor["ghgConversionFactor"]
            : 0;
        this.secrEnergy = this.amount * factor;
        this.secrEnergy = this.secrEnergy.toFixed(5);
      }
      if (this.unit === CC_UNITS.CUBIC_METERS) {
        let defraFactor1 = await CCFactors.findOne({
          year: 2023, // only 2023 records are found in the excell
          combinedActivityReference: this.activity,
          uom: CC_UNITS.KG_PER_M3_DENSITY,
        });
        let defraFactor2 = await CCFactors.findOne({
          year: 2023, // only 2023 records are found in the excell
          combinedActivityReference: this.activity,
          uom: CC_UNITS.KWH_PER_KG_NET_CV,
        });
        const factor1 =
          defraFactor1 && defraFactor1["ghgConversionFactor"]
            ? defraFactor1["ghgConversionFactor"]
            : 0;
        const factor2 =
          defraFactor2 && defraFactor2["ghgConversionFactor"]
            ? defraFactor2["ghgConversionFactor"]
            : 0;
        this.secrEnergy = this.amount * factor1 * factor2;
        this.secrEnergy = this.secrEnergy.toFixed(5);
      }
      if (this.unit === CC_UNITS.LITRES) {
        let defraFactor = await CCFactors.findOne({
          year: 2023, // only 2023 records are found in the excell
          combinedActivityReference: this.activity,
          uom: CC_UNITS.KWH_PER_LITRE_NET_CV,
        });
        const factor =
          defraFactor && defraFactor["ghgConversionFactor"]
            ? defraFactor["ghgConversionFactor"]
            : 0;
        this.secrEnergy = this.amount * factor;
        this.secrEnergy = this.secrEnergy.toFixed(5);
      }
      if (this.unit === CC_UNITS.KWH_NET_CV) {
        this.secrEnergy = this.amount;
      }
      if (this.unit === CC_UNITS.KWH_GROSS_CV) {
        let defraFactor = await CCFactors.findOne({
          year: this.emmisionFactorDbYear,
          scope: CC_EMISSION_SCOPES.SCOPE_1,
          combinedActivityReference: this.activity,
          uom: CC_UNITS.KWH_NET_CV,
          ghgPerUnit: CC_GHG_GASSES.CO2E,
        });
        const factor =
          defraFactor && defraFactor["ghgConversionFactor"]
            ? defraFactor["ghgConversionFactor"]
            : 0;
        this.secrEnergy = (this.ghgCo2eEmission * 1000) / factor;
        this.secrEnergy = this.secrEnergy.toFixed(5);
      }
    }
    if (
      [
        CC_EMISSION_CATEGORY_NAMES.COMPANY_VEHICLES,
        CC_EMISSION_CATEGORY_NAMES.BUSINESS_TRAVEL,
      ].includes(this.category)
    ) {
      if (
        [
          CC_CALCULATION_METHODS.DISTANCE_BASED_METHOD,
          CC_CALCULATION_METHODS.DISTANCE_BASED_VEHICLES_METHOD,
        ].includes(this.calculationMethod)
      ) {
        let defraFactor = await CCFactors.findOne({
          year: this.emmisionFactorDbYear,
          scope: CC_EMISSION_SCOPES.SCOPE_1,
          level1: "SECR kWh pass & delivery vehs",
          combinedActivityReference: this.activity,
          uom: this.unit,
          ghgPerUnit: CC_UNITS.KWH_NET_CV,
        });
        const factor =
          defraFactor && defraFactor["ghgConversionFactor"]
            ? defraFactor["ghgConversionFactor"]
            : 0;

        this.secrEnergy = this.amount * factor;
        this.secrEnergy = this.secrEnergy.toFixed(5);
      }
      if (this.calculationMethod === CC_CALCULATION_METHODS.FUEL_BASED_METHOD) {
        let defraFactor = await CCFactors.findOne({
          year: 2023, // only 2023 records are found in the excell
          combinedActivityReference: this.activity,
          uom: CC_UNITS.KWH_PER_LITRE_NET_CV,
        });
        const factor =
          defraFactor && defraFactor["ghgConversionFactor"]
            ? defraFactor["ghgConversionFactor"]
            : 0;
        this.secrEnergy = this.amount * factor;
        this.secrEnergy = this.secrEnergy.toFixed(5);
      }
    }
    if([CC_EMISSION_CATEGORY_NAMES.PURCHASED_ELECTRICITY].includes(this.category)){
      this.secrEnergy = this.amount;
    }
  } catch (err) {
    logger.error("secr energy calculation error: ", err);
  }
}
/**
 * @param {import("mongoose").Schema} schema
 */
module.exports = (schema) => {
  schema.add({
    secrEnergy: {
      type: Number,
      default: 0,
    },
  });
  schema.pre("save", calc);
};
