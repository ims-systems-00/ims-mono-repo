const { SERVER_EVENTS } = require("../../constants");
const ActivityService = require("../../../services/activity");
const moment = require("moment");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");
module.exports = {
  [SERVER_EVENTS.AI_ANALYSIS_CONDUCTED]: async function (data) {
    const activityService = new ActivityService(data.connection);
    try {
      logger.info("creaating a ai-response activity", {_id: data?.aiResponse?._id});
      await activityService.createActivity({
        moduleType: data?.aiResponse?.source?.moduleType,
        isAutomated: true,
        iconSrc: `${process.env.ASSETS_BASE_URL}/images/system/notification/analysis.png`,
        moduleId: data?.aiResponse?.source?.module?._id,
        value: `${data?.aiResponse?.created?.by?.name} conducted and saved an analysis.`,
        extraLogs: [],
        metaInfo: {},
        createdBy: data?.aiResponse?.created?.by?._id,
      });
    } catch (error) {
      logger.info(error);
    }
  },
};
