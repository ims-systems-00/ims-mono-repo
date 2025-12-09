const { SERVER_EVENTS } = require("../../constants");
const ActivityService = require("../../../services/activity");
const {
  ComplianceToolCRUDOps,
} = require("../../../services/complianceManager");

const moment = require("moment");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");
module.exports = {
  [SERVER_EVENTS.CONTROL_HAS_BEEN_UNLINKED_FROM_MODULE]: async function (data) {
    const activityService = new ActivityService(data.connection);
    const complianceToolCrudOps = new ComplianceToolCRUDOps(data.connection);
    try {
      const controls = await complianceToolCrudOps.getComplainceTool(
        { _id: { $in: data.controls || [] } },
        { limit: 50 }
      );
      logger.info("unlinking a control", {moduleType: data?.moduleType, _id: data?.module?._id});
      await activityService.createActivity({
        moduleType: data?.moduleType,
        isAutomated: true,
        iconSrc: `${process.env.ASSETS_BASE_URL}/images/system/notification/link.png`,
        moduleId: data?.module?._id,
        value: `${data?.user?.name} unlinked compliance control(s).`,
        extraLogs: [
          {
            title: "Unlinked control(s)",
            description: `
${controls.compliance
  ?.map((control) => {
    return `${control.name} ${control?.control?.clause}: ${control?.control?.title}\n`;
  })
  .join("\n")}
`,
            icon: `${process.env.ASSETS_BASE_URL}/images/system/notification/link-2.png`,
            image: `${process.env.ASSETS_BASE_URL}/images/system/notification/link-2.png`,
          },
        ],
        metaInfo: {},
        createdBy: data?.user?._id,
      });
    } catch (error) {
      logger.info(error);
    }
  },
};
