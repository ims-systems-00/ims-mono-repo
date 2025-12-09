const { models } = require("../models");
const dynamicModelCompiler = async (req, res, next) => {
  Object.keys(models).forEach((key) => {
    let model = models[key];
    model(req.accessControl);
  });
  next();
};
module.exports = { dynamicModelCompiler };
