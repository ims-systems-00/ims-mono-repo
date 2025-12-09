const { connectAllDb } = require("configs/dbManager/systemDbConnection");
const { tickOrgDashBoard } = require("./src/schedules/updateDashBoardState");
const {logger} = require("@ims-systems-00/ims-core/lib/logger")
const {
  tickBUDashboard,
} = require("./src/schedules/updateBusinessFunctionDashboards");
(async function () {
  try {
    await connectAllDb();
    tickOrgDashBoard();
    tickBUDashboard();
  } catch (err) {
    logger.info(err);
  }
})();
