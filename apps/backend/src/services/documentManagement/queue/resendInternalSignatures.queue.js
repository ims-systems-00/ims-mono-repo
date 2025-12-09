const Bull = require("bull");
const resendInternalSignaturesProcess = require("./resendInternalSignatures.process");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");
const resendInternalSignaturesQueue = new Bull(
  "resend-internal-signature-queue",
  process.env.REDIS_URL
);
resendInternalSignaturesQueue.process(resendInternalSignaturesProcess.consume);
exports.produce = (data) => {
  resendInternalSignaturesQueue.add(data, {});
};
resendInternalSignaturesQueue.on("completed", (job) => {
  resendInternalSignaturesProcess.completeAction(job);
  logger.info("cleaning up the completed document review jobs.");
  resendInternalSignaturesQueue.clean(0, "completed");
});
exports.cleanCompleted = (...args) => {
  resendInternalSignaturesQueue.clean(...args);
};
