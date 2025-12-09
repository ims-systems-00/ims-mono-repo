const Bull = require("bull");
const usermentionsProcess = require("./usermentions.process");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");
const usermentionsQueue = new Bull("usermentions", process.env.REDIS_URL);
usermentionsQueue.process(usermentionsProcess.consume);
exports.produce = (data) => {
  usermentionsQueue.add(data, {});
};
usermentionsQueue.on("completed", (job) => {
  usermentionsProcess.completeAction(job);
  logger.info("cleaning up the completed campaign jobs.");
  usermentionsQueue.clean(0, "completed");
});
exports.cleanCompleted = (...args) => {
  usermentionsQueue.clean(...args);
};
