require("dotenv").config();
const { connectAllDb } = require("../../config/dbManager/systemDbConnection");
const { tickDashBoard } = require("../../schedules/updateDashBoardState");
(async function () {
  await connectAllDb();
  tickDashBoard();
})();
