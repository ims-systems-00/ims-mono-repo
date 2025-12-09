const { SERVER_EVENTS } = require("../../constants");
const ActivityService = require("../../../services/activity");
const moment = require("moment");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");
module.exports = {
  [SERVER_EVENTS.RISK_ACCEPTED]: async function (data) {
    const activityService = new ActivityService(data.connection);
    try {
      logger.info("creating a risk activity", {_id: data?.risk?._id});
      await activityService.createActivity({
        moduleType: "risks",
        isAutomated: true,
        iconSrc: `${process.env.ASSETS_BASE_URL}/images/system/notification/mitigated.png`,
        moduleId: data?.risk?._id,
        value: `${data?.risk?.accepted?.by?.name} accepted this risk.`,
        extraLogs: [],
        metaInfo: {},
        createdBy: data?.risk?.accepted?.by?._id,
      });
    } catch (error) {
      logger.info(error);
    }
  },
};
