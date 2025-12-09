const { logger } = require("@ims-systems-00/ims-core/lib/logger");
const CCFactorsModel = require("../../ccFactors");
const {
  CC_GHG_GASSES,
  CC_CALCULATION_METHODS,
  CC_EMISSION_CATEGORY_NAMES,
} = require("../../ccEnum");
const { REFIRGERANT_GHG_MAPS } = require("./refrigerantMaps");
async function calc() {
  try {
    if (
      [
        CC_EMISSION_CATEGORY_NAMES.PROCESS_EMISSIONS,
        CC_EMISSION_CATEGORY_NAMES.FUGITIVE_EMISSIONS,
      ].includes(this.category) &&
      REFIRGERANT_GHG_MAPS[this.activity] === CC_GHG_GASSES.HFC
    ) {
      this.ghgHfcEmission = this.ghgCo2eEmission;
    } else this.ghgHfcEmission = 0;
  } catch (err) {
    logger.error("ghg(hfc) calculation error: ", err);
  }
}
/**
 * @param {import("mongoose").Schema} schema
 */
module.exports = (schema) => {
  schema.add({
    ghgHfcEmission: {
      type: Number,
      default: null,
    },
  });
  schema.pre("save", calc);
};
