const Bull = require("bull");
const extractReportProcess = require("./extractReport.process");
const extractReportQueue = new Bull("extractreport", process.env.REDIS_URL);
extractReportQueue.process(extractReportProcess.consume);
exports.produce = (data) => {
  extractReportQueue.add(data, {});
};
extractReportQueue.on("completed", (job) => {
  extractReportProcess.completeAction(job);
  extractReportQueue.clean(0, "completed");
});
extractReportQueue.on("error", (error) => {
  // console.error(error);
});
exports.cleanCompleted = (...args) => {
  extractReportQueue.clean(...args);
};
