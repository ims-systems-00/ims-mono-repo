const { logger } = require("@ims-systems-00/ims-core/lib/logger");
const {
  CC_EMISSION_CATEGORY_NAMES,
  CC_CALCULATION_METHODS,
} = require("../../ccEnum");
function calc() {
  try {
    if (CC_EMISSION_CATEGORY_NAMES.COMPANY_PREMISES === this.category) {
      this.secrToInclude = "Yes";
    }
    if (
      [
        CC_EMISSION_CATEGORY_NAMES.COMPANY_VEHICLES,
        CC_EMISSION_CATEGORY_NAMES.BUSINESS_TRAVEL,
      ].includes(this.category)
    ) {
      if (
        [
          CC_CALCULATION_METHODS.FUEL_BASED_METHOD,
          CC_CALCULATION_METHODS.DISTANCE_BASED_METHOD,
          CC_CALCULATION_METHODS.DISTANCE_BASED_VEHICLES_METHOD,
        ].includes(this.calculationMethod)
      ) {
        this.secrToInclude = "Yes";
      } else {
        this.secrToInclude = "No";
      }
    }
  } catch (err) {
    logger.error("secr to include error: ", err);
  }
}
/**
 * @param {import("mongoose").Schema} schema
 */
module.exports = (schema) => {
  schema.add({
    secrToInclude: {
      type: String,
      default: null,
    },
  });
  schema.pre("save",calc);
};
