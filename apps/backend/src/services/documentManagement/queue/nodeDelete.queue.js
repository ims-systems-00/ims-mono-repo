const Bull = require("bull");
const nodeDeleteProcess = require("./nodeDelete.process");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");
const nodeDeleteQueue = new Bull("fileTreeNodeDelete", process.env.REDIS_URL);
nodeDeleteQueue.process(nodeDeleteProcess.consume);
exports.produce = (data) => {
  nodeDeleteQueue.add(data, {});
};
nodeDeleteQueue.on("completed", (job) => {
  nodeDeleteProcess.completeAction(job);
  logger.info("cleaning up the completed node delete jobs.");
  nodeDeleteQueue.clean(0, "completed");
});
exports.cleanCompleted = (...args) => {
  nodeDeleteQueue.clean(...args);
};
