const { SERVER_EVENTS } = require("../../constants");
const ActivityService = require("../../../services/activity");
const moment = require("moment");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");
module.exports = {
  [SERVER_EVENTS.RISK_ESCALATED]: async function (data) {
    const activityService = new ActivityService(data.connection);
    try {
      logger.info(`"creating a risk activity", ${data?.risk?._id}`);
      await activityService.createActivity({
        moduleType: "risks",
        isAutomated: true,
        iconSrc: `${process.env.ASSETS_BASE_URL}/images/system/notification/escalated.png`,
        moduleId: data?.risk?._id,
        value: `${data?.risk?.escalated?.by?.name} escalated this risk.`,
        extraLogs: [],
        metaInfo: {},
        createdBy: data?.risk?.escalated?.by?._id,
      });
    } catch (error) {
      logger.info(error);
    }
  },
};
