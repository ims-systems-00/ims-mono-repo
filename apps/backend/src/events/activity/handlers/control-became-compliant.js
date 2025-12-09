const { SERVER_EVENTS } = require("../../constants");
const ActivityService = require("../../../services/activity");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");
module.exports = {
  [SERVER_EVENTS.CONTROL_BECAME_COMPLIANT]: async function (data) {
    const activityService = new ActivityService(data.connection);
    try {
      let a = await activityService.createActivity({
        moduleType: "controlstatuses",
        isAutomated: true,
        iconSrc: `${process.env.ASSETS_BASE_URL}/images/system/notification/goal.png`,
        moduleId: data.control?._id,
        value: `Control has been selected and implemented.`,
        extraLogs: [
          {
            title: "System logs",
            description: `${data.message}`,
            icon: `${process.env.ASSETS_BASE_URL}/images/system/notification/goal.png`,
            image: `${process.env.ASSETS_BASE_URL}/images/system/notification/goal.png`,
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
