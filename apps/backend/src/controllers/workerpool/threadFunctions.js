const workerPool = require("workerpool");
const { connectDataBase } = require("../../config/databaseManager");

const {
  sendDashBoardReports,
  checkoutSystemEndDate,
} = require("../../schedules/schedules");

const runSchedules = () => {
  connectDataBase();
  // sendDashBoardReports();
  checkoutSystemEndDate();
};
workerPool.worker({
  runSchedules,
});
