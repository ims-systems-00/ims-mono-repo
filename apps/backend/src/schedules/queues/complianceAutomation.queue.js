const Bull = require("bull");
const complainceAutomationProcess = require("./complainceAutomation.process");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");
const complianceAutomationQueue = new Bull(
  "compliance-automation-queue",
  process.env.REDIS_URL
);
complianceAutomationQueue.process(complainceAutomationProcess.consume);
exports.produce = (data) => {
  complianceAutomationQueue.add(data, {});
};
complianceAutomationQueue.on("completed", (job) => {
  complainceAutomationProcess.completeAction(job);
  logger.info("cleaning up the auto compliance review jobs.");
  complianceAutomationQueue.clean(0, "completed");
});
exports.cleanCompleted = (...args) => {
  complianceAutomationQueue.clean(...args);
};
