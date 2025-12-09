const Bull = require("bull");
const mailProcess = require("./mail.process");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");
const mailQueue = new Bull("mail", process.env.REDIS_URL);
mailQueue.process(mailProcess.consume);
exports.produce = (data = { list: [], campaignId: "", tenantName: "" }) => {
  mailQueue.add(data, {});
};
mailQueue.on("completed", (job) => {
  mailProcess.completeAction(job);
  logger.info("cleaning up the completed mail jobs...");
  mailQueue.clean(0, "completed");
});
exports.cleanCompleted = (...args) => {
  mailQueue.clean(...args);
};
