const themes = {
  ...require("./fresh/index"),
};
/**
 * This contains
 * @param {import('pdfkit')} doc - this recives a pdf kit document object.
 */
const draw = (themeName) => (doc) => {
  if (!doc) throw new Error("Document is required to draw.");
  themes[themeName](doc);
};
module.exports = { draw };
