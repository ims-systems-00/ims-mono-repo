const Bull = require("bull");
const repoDeleteProcess = require("./repoDelete.process");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");
const repoDeleteQueue = new Bull("documentRepoDelete", process.env.REDIS_URL);
repoDeleteQueue.process(repoDeleteProcess.consume);
exports.produce = (data) => {
  repoDeleteQueue.add(data, {});
};
repoDeleteQueue.on("completed", (job) => {
  repoDeleteProcess.completeAction(job);
  logger.info("cleaning up the completed node delete jobs.");
  repoDeleteQueue.clean(0, "completed");
});
exports.cleanCompleted = (...args) => {
  repoDeleteQueue.clean(...args);
};
