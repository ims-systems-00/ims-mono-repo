const Bull = require("bull");
const campaignProcess = require("./campaign.process");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");
const campaignQueue = new Bull("campaign", process.env.REDIS_URL);
campaignQueue.process(campaignProcess.consume);
exports.produce = (data) => {
  campaignQueue.add(data, {});
};
campaignQueue.on("completed", (job) => {
  campaignProcess.completeAction(job);
  logger.info("cleaning up the completed campaign jobs.");
  campaignQueue.clean(0, "completed");
});
exports.cleanCompleted = (...args) => {
  campaignQueue.clean(...args);
};
