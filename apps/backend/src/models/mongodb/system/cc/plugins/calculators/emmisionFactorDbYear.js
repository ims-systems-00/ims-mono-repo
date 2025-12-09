const { logger } = require("@ims-systems-00/ims-core/lib/logger");
const {
  CC_ALLOWED_NET_ZERO_REPORTING_YEARS,
  CC_EMISSION_CATEGORY_NAMES,
  CC_CALCULATION_METHODS,
} = require("../../ccEnum");
const CCParametersModel = require("../../ccParameters");
async function calc(next) {
  let CCParameters = CCParametersModel();
  try {
    let ccParameter = await CCParameters.findOne({
      organization: this.organization,
    });
    this.emmisionFactorDbYear =
      this.reportingYear - (ccParameter?.emissionFactorDBYearCountFactor || 0);
    if (
      [
        CC_EMISSION_CATEGORY_NAMES.PROCESS_EMISSIONS,
        CC_EMISSION_CATEGORY_NAMES.FUGITIVE_EMISSIONS,
      ].includes(this.category)
    ) {
      if (this.emmisionFactorDbYear < 2022) this.emmisionFactorDbYear = 2022;
    }
    if (
      [
        CC_EMISSION_CATEGORY_NAMES.PURCHASED_GOODS_AND_SERVICES,
        CC_EMISSION_CATEGORY_NAMES.CAPITAL_GOODS,
        CC_EMISSION_CATEGORY_NAMES.UPSTREAM_TRANSPORTATION_AND_DISTRIBUTION,
        CC_EMISSION_CATEGORY_NAMES.BUSINESS_TRAVEL,
        CC_EMISSION_CATEGORY_NAMES.DOWNSTREAM_TRANSPORTATION_AND_DISTRIBUTION,
      ].includes(this.category) &&
      [CC_CALCULATION_METHODS.SPEND_BASED_METHOD].includes(
        this.calculationMethod
      )
    ) {
      if (this.emmisionFactorDbYear < 2020) this.emmisionFactorDbYear = 2019;
      else this.emmisionFactorDbYear = 2020;
    }
    if (
      [CC_EMISSION_CATEGORY_NAMES.EMPLOYEE_COMMUTING].includes(this.category) &&
      [CC_CALCULATION_METHODS.SPEND_BASED_METHOD].includes(
        this.calculationMethod
      )
    ) {
      if (this.emmisionFactorDbYear < 2023) this.emmisionFactorDbYear = 2019;
      else this.emmisionFactorDbYear = 2020;
    }
    if (
      [CC_EMISSION_CATEGORY_NAMES.EMPLOYEE_COMMUTING_HOMEWORKING].includes(
        this.category
      )
    ) {
      if (this.emmisionFactorDbYear < 2022) this.emmisionFactorDbYear = 2022;
    }
    if (this.emmisionFactorDbYear < 2019) this.emmisionFactorDbYear = 2019;
  } catch (err) {
    logger.error("ef db year calculation error: ", err);
  }
}
/**
 * @param {import("mongoose").Schema} schema
 */
module.exports = (schema) => {
  schema.add({
    emmisionFactorDbYear: {
      type: Number,
      enum: CC_ALLOWED_NET_ZERO_REPORTING_YEARS,
      default: null,
    },
  });
  schema.pre("save", calc);
};
