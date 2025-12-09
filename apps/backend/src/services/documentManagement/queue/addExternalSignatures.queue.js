const Bull = require("bull");
const addExternalSignaturesProcess = require("./addExternalSignatures.process");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");
const addExternalSignaturesQueue = new Bull(
  "external-signature-queue",
  process.env.REDIS_URL
);
addExternalSignaturesQueue.process(addExternalSignaturesProcess.consume);
exports.produce = (data) => {
  addExternalSignaturesQueue.add(data, {});
};
addExternalSignaturesQueue.on("completed", (job) => {
  addExternalSignaturesProcess.completeAction(job);
  logger.info("cleaning up the completed document review jobs.");
  addExternalSignaturesQueue.clean(0, "completed");
});
exports.cleanCompleted = (...args) => {
  addExternalSignaturesQueue.clean(...args);
};
