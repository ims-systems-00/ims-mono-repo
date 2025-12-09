const { colors } = require("../variables/colors");
exports.getColoursByPercentage = (percentage) => {
  if (percentage >= 75) return colors.success;
  if (percentage >= 50) return colors.warning;
  if (percentage >= 25) return colors.info;
  if (percentage >= 1) return colors.danger;
};
