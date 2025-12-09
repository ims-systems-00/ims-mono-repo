function parseBooleanQuery(value) {
  return (value + "").trim().toLowerCase() === "true";
}
module.exports = { parseBooleanQuery };
