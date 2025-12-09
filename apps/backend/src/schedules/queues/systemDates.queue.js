const Bull = require("bull");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");
export const q = new Bull("mail", process.env.REDIS_URL);
q.process(async (job) => {
  logger.info("Retriveing tenants...");
  try {
  } catch (err) {
    logger.info(err);
  }
});

q.on("completed", (job) => {
  q.completeAction(job);
  logger.info("cleaning up the completed mail jobs...");
  mailQueue.clean(0, "completed");
});