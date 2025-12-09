const Bull = require("bull");
const noticeProcess = require("./notice.process");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");
const queue = new Bull("noticequeue", process.env.REDIS_URL);
queue.process(noticeProcess.consume);
exports.produce = (data = {}) => {
  queue.add(data, {});
};
queue.on("completed", (job) => {
  noticeProcess.completeAction(job);
  logger.info("cleaning up the completed mail jobs...");
  queue.clean(0, "completed");
});
exports.cleanCompleted = (...args) => {
  queue.clean(...args);
};
