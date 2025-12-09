const { CC_DATA_QUALITY_GRADE_SCORE_MAP } = require("../../ccEnum");
function calc() {
  this.dataQualityEmissionFactorScore =
    CC_DATA_QUALITY_GRADE_SCORE_MAP[this.dataQualityEmissionFactorGrade];
}
/**
 * @param {import("mongoose").Schema} schema
 */
module.exports = (schema) => {
  schema.add({
    dataQualityEmissionFactorScore: {
      type: Number,
      default: 0,
    },
  });
  schema.pre("save", calc);
};
