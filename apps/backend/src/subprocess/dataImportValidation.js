const DataImportService = require("../services/dataImport/dataImport");
const { connectDataBase } = require("../config/databaseManager");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");
/**
 * validation progress coefficient decides how often a validation
 * progress is sent to frontend to update the UI.
 */
const _validationProgressionCoefficient = 50;
let _startValidation = async ({
  accessControl,
  module,
  dataMap,
  dataSet,
  dateFormat,
}) => {
  await connectDataBase();
  let connection = accessControl;
  let dataImportService = new DataImportService(connection);
  let validation = dataImportService.validateDataSet(
    { module, dataMap, dataSet, dateFormat },
    /**
     * following callback is invoked after every row validation of a
     * single column
     */
    ({ field, rowNumber }) => {
      rowNumber -= 1;
      let progress =
        dataSet.length > 0 ? (rowNumber / dataSet.length) * 100 : 0;
      progress = progress.toFixed(2);
      logger.info(`${field}, " progress: ", ${progress}`);
      if (
        rowNumber %
          parseInt(dataSet.length / _validationProgressionCoefficient) ===
        0
      )
        process.send({
          message: "validation-progress",
          field,
          rowNumber,
          progress: progress,
        });
    }
  );
  return validation;
};
process.on("message", async (message) => {
  let result = await _startValidation(message);
  process.send({
    message: "validation-end",
    result,
    pid: message?.pid,
  });
});
