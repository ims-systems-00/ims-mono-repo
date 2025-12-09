const DataImportService = require("../../services/dataImport/dataImport");
const getModuleSchema = (req, res, next) => {
  try {
    let dataImportService = new DataImportService(req.accessControl);
    let { module } = req.params;
    let schema = dataImportService.getSchema(module);
    res.status(200).json({
      message: "Schema retrived successfully.",
      schema,
    });
  } catch (err) {
    next(err)
  }
};
module.exports = {
  getModuleSchema,
};
