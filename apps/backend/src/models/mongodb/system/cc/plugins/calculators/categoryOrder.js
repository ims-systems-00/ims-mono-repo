const { CC_EMISSION_CATEGORY_ORDERS } = require("../../ccEnum");
function calc() {
  this.categoryOrder = CC_EMISSION_CATEGORY_ORDERS[this.category];
}
/**
 * @param {import("mongoose").Schema} schema
 */
module.exports = (schema) => {
  schema.add({
    categoryOrder: {
      type: String,
      default: null,
    },
  });
  schema.pre("save", calc);
};
