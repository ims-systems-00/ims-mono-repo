const eventsHandlers = {
  ...require("./handlers/analysis-conducted"),
  ...require("./handlers/analysis-deleted"),

};
module.exports = eventsHandlers;
