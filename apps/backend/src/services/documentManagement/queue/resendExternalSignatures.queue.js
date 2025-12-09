const Bull = require("bull");
const resendExternalSignaturesProcess = require("./resendExternalSignatures.process");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");
const resendExternalSignaturesQueue = new Bull(
  "resend-external-signature-queue",
  process.env.REDIS_URL
);
resendExternalSignaturesQueue.process(resendExternalSignaturesProcess.consume);
exports.produce = (data) => {
  resendExternalSignaturesQueue.add(data, {});
};
resendExternalSignaturesQueue.on("completed", (job) => {
  resendExternalSignaturesProcess.completeAction(job);
  logger.info("cleaning up the completed document review jobs.");
  resendExternalSignaturesQueue.clean(0, "completed");
});
exports.cleanCompleted = (...args) => {
  resendExternalSignaturesQueue.clean(...args);
};
