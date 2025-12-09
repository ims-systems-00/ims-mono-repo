const { CC_DATA_QUALITY_GRADE_SCORE_MAP } = require("../../ccEnum");
function calc() {
  this.dataQualityADScore =
    CC_DATA_QUALITY_GRADE_SCORE_MAP[this.activityDataGrade];
}
/**
 * @param {import("mongoose").Schema} schema
 */
module.exports = (schema) => {
  schema.add({
    dataQualityADScore: {
      type: Number,
      default: null,
    },
  });
  schema.pre("save", calc);
};
