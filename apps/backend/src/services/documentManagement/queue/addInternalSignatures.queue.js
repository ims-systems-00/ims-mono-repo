const Bull = require("bull");
const addInternalSignaturesProcess = require("./addInternalSignatures.process");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");
const addInternalSignaturesQueue = new Bull(
  "internal-signature-queue",
  process.env.REDIS_URL
);
addInternalSignaturesQueue.process(addInternalSignaturesProcess.consume);
exports.produce = (data) => {
  addInternalSignaturesQueue.add(data, {});
};
addInternalSignaturesQueue.on("completed", (job) => {
  addInternalSignaturesProcess.completeAction(job);
  logger.info("cleaning up the completed document review jobs.");
  addInternalSignaturesQueue.clean(0, "completed");
});
exports.cleanCompleted = (...args) => {
  addInternalSignaturesQueue.clean(...args);
};
