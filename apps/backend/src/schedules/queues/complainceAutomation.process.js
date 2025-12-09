const { logger } = require("@ims-systems-00/ims-core/lib/logger");
const complianceService = require("../../services/complianceManager");
exports.consume = async (job) => {
  let connection = job.data?.accessControl;
  let complianceCrudOps = new complianceService.ComplianceToolCRUDOps(
    connection
  );
  let controlManager = new complianceService.ControlsManager(connection);
  try {
    let page = 1;
    while (page) {
      let result = await complianceCrudOps.getComplainceTool(
        {
          "moreInfo.applicableModules": job.data?.moduleType,
          isLocked: false,
        },
        { page, limit: 100 }
      );
      logger.info(result.pagination);
      let { compliance } = result;
      compliance = compliance.filter((cmp) => cmp.state !== "Implemented");
      if (compliance.length) {
        for (let cmp of compliance) {
          logger.info(`
            ${cmp.state},
            "complying==>",
            ${cmp.name},
            ${cmp.control.clause},
            ${cmp.control.isLocked}`);
          await controlManager.updateControl({
            name: cmp.name,
            clause: cmp.control.clause,
            state: "Implemented",
            selected: "Selected",
            user: job.data.user,
            imsAutomated: true,
          });
        }
      }
      if (!result.pagination.hasNextPage) break;
      page = result.pagination.nextPage;
    }
  } catch (error) {
    logger.info(error);
  }
};
exports.completeAction = async (job) => {};
