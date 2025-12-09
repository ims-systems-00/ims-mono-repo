const moment = require("moment");
module.exports = function (config) {
  let castTo = (type) => (value) => {
    switch (type) {
      case "string":
        return value.toString();
      case "number":
        return value;
      case "date":
        return new Date(moment(value, config.dateFormat || "DD/MM/YYYY"));
      case "array":
        return Array.isArray(value) ? value : [value];
      default:
        return value;
    }
  };
  return { castTo };
};
