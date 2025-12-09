const Bull = require("bull");
const handleOwnershipIntegrityProcess = require("./handleOwnershipIntegrity.process");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");
const handleOwnershipIntegrityQueue = new Bull(
  "transfer-data-ownership-queue",
  process.env.REDIS_URL
);
handleOwnershipIntegrityQueue.process(handleOwnershipIntegrityProcess.consume);
exports.produce = (data) => {
  handleOwnershipIntegrityQueue.add(data, {});
};
handleOwnershipIntegrityQueue.on("completed", (job) => {
  handleOwnershipIntegrityProcess.completeAction(job);
  logger.info("cleaning up the completed user integrity jobs.");
  handleOwnershipIntegrityQueue.clean(0, "completed");
});
exports.cleanCompleted = (...args) => {
  handleOwnershipIntegrityQueue.clean(...args);
};
exports.isRunning = async (cb) => {
  let jobs = await handleOwnershipIntegrityQueue.getJobs();
  let job = jobs.find((job) => {
    return cb(job.data);
  });
  logger.info(job);
  if (job) return true;
  return false;
};
