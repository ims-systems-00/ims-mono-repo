// // * * * * * *
// // | | | | | |
// // | | | | | day of week
// // | | | | month
// // | | | day of month
// // | | hour
// // | minute
// // second ( optional )

const cron = require("node-cron");
const { fork } = require("child_process");
const DashBoardModel = require("../models/mongodb/system/dashboard/dashboard");
const { v4: uuidv4 } = require("uuid");
const OrganizationModel = require("../models/mongodb/system/organization/organization");
const KpiObjectiveModel = require("../models/mongodb/system/managementReview/kpiObjective");
const path = require("path");

const {
  getConnectionMap,
} = require("../config/dbManager/systemDbConnection");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");
// const extractReportQueue = require("./queues/extractReport.queue");
async function tickSendReport() {
  let tenantsMap = getConnectionMap();
  try {
    logger.info("Send report schedule started....");
    const today = new Date();
    await Promise.all(
      tenantsMap.map(async (tenant) => {
        let DashBoard = DashBoardModel();
        let Organization = OrganizationModel();
        let KpiObjective = KpiObjectiveModel();
        let orgnaizations = await Organization.find({});
        await Promise.all(
          orgnaizations.map(async (organization) => {
            // generate report...
            let dashBoard = await DashBoard.findOne({
              organizationId: organization._id,
            });
            let kpiObjectives = await KpiObjective.find({
              organizationId: organization._id,
              businessFunctionId: null,
            });
            dashBoard = await DashBoard.populateDashBoard(dashBoard);
            organization.reportSubscriptions = await Promise.all(
              organization.reportSubscriptions.map(async (subscriber) => {
                if (
                  today.toLocaleDateString() ===
                  subscriber.nextDate.toLocaleDateString()
                ) {
                  let fileName = `ims-dashboard-report-${uuidv4()}.pdf`;
                  let document = {
                    path: `./temp/${fileName}`,
                    fileName,
                  };
                  /**
                   * NOTE : Here we are opning a sub process to generate the queue.
                   * Reason for opening a sub-process is because the PDF generator
                   * lib requires canvas-node as it's depency which does not support or
                   * fails to self-register in threads. But works/supports in the sub-process.
                   * Hence in order tho get the lib working a work-arround solution has been implemented
                   * here by running the queue in a sub-process.
                   * See issue on GITHUB : https://github.com/vitest-dev/vitest/issues/740
                   */
                  let process = fork(
                    path.resolve(__dirname + "/../subprocess/sendReport.js")
                  );
                  process.send({
                    organization,
                    subscriber,
                    dashBoard,
                    document,
                    kpiObjectives,
                  });
                  process.on("message", (message) => {
                    logger.info("queue generated", { message: message });
                  });
                  let nextDate = new Date(subscriber.nextDate);
                  nextDate.setMonth(nextDate.getMonth() + 1);
                  subscriber.nextDate = nextDate;
                  logger.info("Send scheduled !");
                }
                return subscriber;
              })
            );
            await organization.save();
          })
        );
      })
    );
    logger.info("Send report schedule finished....");
  } catch (err) {
    logger.info(err);
    return null;
  }
}

// send report every midnight....
exports.sendDashBoardReports = () => cron.schedule("0 0 * * *", tickSendReport);
