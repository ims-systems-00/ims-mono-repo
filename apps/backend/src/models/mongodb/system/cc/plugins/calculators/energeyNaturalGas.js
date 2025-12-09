const { logger } = require("@ims-systems-00/ims-core/lib/logger");
const CCFactorsModel = require("../../ccFactors");
const {
  CC_GHG_GASSES,
  CC_CALCULATION_METHODS,
  CC_EMISSION_CATEGORY_NAMES,
} = require("../../ccEnum");
async function calc() {
  let CCFactors = CCFactorsModel();
  try {
  } catch (err) {
    logger.error("ghg(natural gas) calculation error: ", err);
  }
}
/**
 * @param {import("mongoose").Schema} schema
 */
module.exports = (schema) => {
  schema.add({
    energeyNaturalGas: {
      type: Number,
      default: null,
    },
  });
  schema.pre("save", calc);
};
