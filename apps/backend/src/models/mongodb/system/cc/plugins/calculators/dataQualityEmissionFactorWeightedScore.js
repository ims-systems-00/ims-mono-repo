function calc() {
  let co2eWeight = this.ghgCo2eEmission || 0;
  let efScore = this.dataQualityEmissionFactorScore || 0;
  this.dataQualityEmissionFactorWeightedScore = (co2eWeight * efScore).toFixed(5);
}
/**
 * @param {import("mongoose").Schema} schema
 */
module.exports = (schema) => {
  schema.add({
    dataQualityEmissionFactorWeightedScore: {
      type: Number,
      default: null,
    },
  });
  schema.pre("save", calc);
};
