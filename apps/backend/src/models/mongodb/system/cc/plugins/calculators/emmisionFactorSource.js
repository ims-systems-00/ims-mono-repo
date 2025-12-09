const { logger } = require("@ims-systems-00/ims-core/lib/logger");
const CCFactorsModel = require("../../ccFactors");
const CCCustomFactorsModel = require("../../ccCustomFactors");

const {
  CC_GHG_GASSES,
  CC_CALCULATION_METHODS,
  CC_EMISSION_CATEGORY_NAMES,
  CC_MISC,
  CC_EMISSION_SCOPES,
} = require("../../ccEnum");
const mongoose = require("mongoose");
async function calc() {
  console.log("validating", this.activity);
  let CCFactors = CCFactorsModel();
  let CCCustomFactors = CCCustomFactorsModel();
  try {
    let defraFactorQuery = {};
    if (
      [
        CC_EMISSION_CATEGORY_NAMES.COMPANY_PREMISES,
        CC_EMISSION_CATEGORY_NAMES.COMPANY_VEHICLES,
        CC_EMISSION_CATEGORY_NAMES.PROCESS_EMISSIONS,
        CC_EMISSION_CATEGORY_NAMES.FUGITIVE_EMISSIONS,
        CC_EMISSION_CATEGORY_NAMES.PURCHASED_ELECTRICITY,
        CC_EMISSION_CATEGORY_NAMES.PURCHASED_GOODS_AND_SERVICES,
        CC_EMISSION_CATEGORY_NAMES.CAPITAL_GOODS,
        CC_EMISSION_CATEGORY_NAMES.UPSTREAM_TRANSPORTATION_AND_DISTRIBUTION,
        CC_EMISSION_CATEGORY_NAMES.WASTE_GENERATED_IN_OPERATIONS,
        CC_EMISSION_CATEGORY_NAMES.BUSINESS_TRAVEL,
        CC_EMISSION_CATEGORY_NAMES.EMPLOYEE_COMMUTING,
        CC_EMISSION_CATEGORY_NAMES.EMPLOYEE_COMMUTING_HOMEWORKING,
        CC_EMISSION_CATEGORY_NAMES.DOWNSTREAM_TRANSPORTATION_AND_DISTRIBUTION,
        CC_EMISSION_CATEGORY_NAMES.PROCESSING_OF_SOLD_PRODUCTS,
        CC_EMISSION_CATEGORY_NAMES.USE_OF_SOLD_PRODUCTS,
        CC_EMISSION_CATEGORY_NAMES.END_OF_LIFE_TREATMENT_OF_SOLD_PRODUCTS,
      ].includes(this.category) &&
      [
        CC_CALCULATION_METHODS.CUSTOM,
        CC_CALCULATION_METHODS.SUPPLIER_SPECIFIC_METHOD,
        CC_CALCULATION_METHODS.MARKET_BASED_METHOD,
      ].includes(this.calculationMethod)
    ) {
      let customFactorQuery = {
        // combinedActivityReference: this.activity,
        // uom: this.unit,
        // ghgPerUnit: CC_GHG_GASSES.CO2E,
        _id: this.customFactorId,
      };
      const customFactor = await CCCustomFactors.findOne(customFactorQuery);
      this.emmisionFactorSource = customFactor["source"];
    }
    if (
      [
        CC_EMISSION_CATEGORY_NAMES.COMPANY_PREMISES,
        CC_EMISSION_CATEGORY_NAMES.COMPANY_VEHICLES,
        CC_EMISSION_CATEGORY_NAMES.PROCESS_EMISSIONS,
        CC_EMISSION_CATEGORY_NAMES.FUGITIVE_EMISSIONS,
        CC_EMISSION_CATEGORY_NAMES.UPSTREAM_TRANSPORTATION_AND_DISTRIBUTION,
        CC_EMISSION_CATEGORY_NAMES.BUSINESS_TRAVEL,
        CC_EMISSION_CATEGORY_NAMES.EMPLOYEE_COMMUTING,
        CC_EMISSION_CATEGORY_NAMES.DOWNSTREAM_TRANSPORTATION_AND_DISTRIBUTION,
      ].includes(this.category) &&
      [CC_CALCULATION_METHODS.FUEL_BASED_METHOD].includes(
        this.calculationMethod
      )
    ) {
      defraFactorQuery = {
        year: this.emmisionFactorDbYear,
        scope: CC_EMISSION_SCOPES.SCOPE_1,
        combinedActivityReference: this.activity,
        uom: this.unit,
        ghgPerUnit: CC_GHG_GASSES.CO2E,
      };
      const defraFactor = await CCFactors.findOne(defraFactorQuery);
      this.emmisionFactorSource = defraFactor["source"];
    }

    if (
      [
        CC_EMISSION_CATEGORY_NAMES.PURCHASED_GOODS_AND_SERVICES,
        CC_EMISSION_CATEGORY_NAMES.CAPITAL_GOODS,
        CC_EMISSION_CATEGORY_NAMES.UPSTREAM_TRANSPORTATION_AND_DISTRIBUTION,
        CC_EMISSION_CATEGORY_NAMES.BUSINESS_TRAVEL,
        CC_EMISSION_CATEGORY_NAMES.EMPLOYEE_COMMUTING,
        CC_EMISSION_CATEGORY_NAMES.DOWNSTREAM_TRANSPORTATION_AND_DISTRIBUTION,
      ].includes(this.category) &&
      [CC_CALCULATION_METHODS.SPEND_BASED_METHOD].includes(
        this.calculationMethod
      )
    ) {
      let sicFactorQuery = {
        year: this.emmisionFactorDbYear,
        sicCategory: this.activity,
      };
      const sicFactor = await CCFactors.findOne(sicFactorQuery);
      this.emmisionFactorSource = sicFactor["source"];
    }
    if (
      [
        CC_EMISSION_CATEGORY_NAMES.PURCHASED_GOODS_AND_SERVICES,
        CC_EMISSION_CATEGORY_NAMES.WASTE_GENERATED_IN_OPERATIONS,
        CC_EMISSION_CATEGORY_NAMES.END_OF_LIFE_TREATMENT_OF_SOLD_PRODUCTS,
      ].includes(this.category) &&
      [CC_CALCULATION_METHODS.AVERAGE_DATA_METHOD].includes(
        this.calculationMethod
      )
    ) {
      defraFactorQuery = {
        year: this.emmisionFactorDbYear,
        scope: CC_EMISSION_SCOPES.SCOPE_3,
        level1: {
          $in: [
            "material use",
            "water supply",
            "waste disposal",
            "water treatment",
          ],
        },
        combinedActivityReference: this.activity,
        uom: this.unit,
        ghgPerUnit: CC_GHG_GASSES.CO2E,
      };
      const defraFactor = await CCFactors.findOne(defraFactorQuery);
      this.emmisionFactorSource = defraFactor["source"];
    }
    if (
      [CC_EMISSION_CATEGORY_NAMES.EMPLOYEE_COMMUTING_HOMEWORKING].includes(
        this.category
      ) &&
      [CC_CALCULATION_METHODS.AVERAGE_DATA_METHOD].includes(
        this.calculationMethod
      )
    ) {
      defraFactorQuery = {
        year: this.emmisionFactorDbYear,
        scope: CC_EMISSION_SCOPES.SCOPE_3,
        combinedActivityReference: this.activity,
        uom: this.unit,
        ghgPerUnit: CC_GHG_GASSES.CO2E,
      };
      const defraFactor = await CCFactors.findOne(defraFactorQuery);
      this.emmisionFactorSource = defraFactor["source"];
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
        CC_CALCULATION_METHODS.DISTANCE_BASED_PUBLIC_TRANSPORT_METHOD,
        CC_CALCULATION_METHODS.DISTANCE_BASED_VEHICLES_METHOD,
        CC_CALCULATION_METHODS.MASS_DISTANCE_BASED_METHOD,
      ].includes(this.calculationMethod)
    ) {
      let freightingGoods = {};
      if (
        [
          CC_EMISSION_CATEGORY_NAMES.UPSTREAM_TRANSPORTATION_AND_DISTRIBUTION,
          CC_EMISSION_CATEGORY_NAMES.DOWNSTREAM_TRANSPORTATION_AND_DISTRIBUTION,
        ].includes(this.category)
      ) {
        freightingGoods = { level1: "freighting goods" };
      }
      let scopeOverride = {};
      if ([CC_EMISSION_CATEGORY_NAMES.COMPANY_VEHICLES].includes(this.category))
        scopeOverride = { scope: CC_EMISSION_SCOPES.SCOPE_1 };
      defraFactorQuery = {
        year: this.emmisionFactorDbYear,
        scope: CC_EMISSION_SCOPES.SCOPE_3,
        combinedActivityReference: this.activity,
        uom: this.unit,
        ghgPerUnit: CC_GHG_GASSES.CO2E,
        ...freightingGoods,
        ...scopeOverride,
      };
      const defraFactor = await CCFactors.findOne(defraFactorQuery);
      this.emmisionFactorSource = defraFactor["source"];
    }
    if (
      [CC_EMISSION_CATEGORY_NAMES.PURCHASED_ELECTRICITY].includes(
        this.category
      ) &&
      [CC_CALCULATION_METHODS.LOCATION_BASED_METHOD].includes(
        this.calculationMethod
      )
    ) {
      defraFactorQuery = {
        year: this.emmisionFactorDbYear,
        scope: CC_EMISSION_SCOPES.SCOPE_2,
        combinedActivityReference: this.activity,
        uom: this.unit,
        ghgPerUnit: CC_GHG_GASSES.CO2E,
      };
      const defraFactor = await CCFactors.findOne(defraFactorQuery);
      this.emmisionFactorSource = defraFactor["source"];
    }
  } catch (err) {
    logger.error("ghg(co2) calculation error: ", err);
  }
}
/**
 * @param {import("mongoose").Schema} schema
 */
module.exports = (schema) => {
  schema.add({
    emmisionFactorSource: {
      type: String,
      default: "",
    },
  });
  schema.pre("save", calc);
};
