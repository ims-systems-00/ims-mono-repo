const mongoose = require("mongoose");
function calc() {
  let co2eWeight = this.ghgCo2eEmission || 0;
  let adScore = this.dataQualityADScore || 0;
  this.dataQualityADWeightedScore = (co2eWeight * adScore).toFixed(5);
}
/**
 * @param {import("mongoose").Schema} schema
 */
module.exports = (schema) => {
  schema.add({
    dataQualityADWeightedScore: {
      type: Number,
      default: 0,
    },
  });
  schema.pre("save", calc);
};
