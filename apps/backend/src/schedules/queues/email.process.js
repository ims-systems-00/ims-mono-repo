const { logger } = require("@ims-systems-00/ims-core/lib/logger");
exports.consume = async (job) => {
  let { template, recipient, payload } = job.data;
  sendMail(template, recipient.email, payload);
};
exports.completeAction = async (job) => {
  logger.info("email send completed actions running");
};
