const Bull = require("bull");
const ownershipChecksProcess = require("./ownershipChecks.process");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");
const ownershipChecksQueue = new Bull(
  "check-user-data-ownership-queue",
  process.env.REDIS_URL
);
ownershipChecksQueue.process(ownershipChecksProcess.consume);
exports.produce = (data) => {
  ownershipChecksQueue.add(data, {});
};
ownershipChecksQueue.on("completed", (job) => {
  ownershipChecksProcess.completeAction(job);
  logger.info("cleaning up the completed user check jobs.");
  ownershipChecksQueue.clean(0, "completed");
});
exports.cleanCompleted = (...args) => {
  ownershipChecksQueue.clean(...args);
};
