const Bull = require("bull");
const emailProcess = require("./email.process");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");
const emailQueue = new Bull("email", process.env.REDIS_URL);
emailQueue.process(emailProcess.consume);
exports.produce = (data) => {
  emailQueue.add(data, {});
};
emailQueue.on("completed", (job) => {
  emailProcess.completeAction(job);
  logger.info("cleaning up the completed mail jobs...");
  emailQueue.clean(0, "completed");
});
exports.cleanCompleted = (...args) => {
  emailQueue.clean(...args);
};
