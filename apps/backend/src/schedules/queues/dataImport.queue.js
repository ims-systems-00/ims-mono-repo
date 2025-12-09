const Bull = require("bull");
const dataImportProcess = require("./dataImport.process");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");
const dataImportQueue = new Bull("dataimport", process.env.REDIS_URL);
dataImportQueue.process(dataImportProcess.consume);
exports.produce = (data) => {
  dataImportQueue.add(data, {});
};
dataImportQueue.on("completed", (job) => {
  dataImportProcess.completeAction(job);
  logger.info("cleaning up the completed document review jobs.");
  dataImportQueue.clean(0, "completed");
});
exports.cleanCompleted = (...args) => {
  dataImportQueue.clean(...args);
};
