const ejs = require("ejs");
const path = require("path");
const createTemplate = async (builder) => {
  const template = await ejs.renderFile(
    path.join(__dirname + `/../assets/${builder.view}`),
    builder.templateOptions || {}
  );
  return template;
};
exports.createTemplate = createTemplate;
