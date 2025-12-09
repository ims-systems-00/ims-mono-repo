const { SERVER_EVENTS } = require("../../constants");
const ActivityService = require("../../../services/activity");
const moment = require("moment");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");
module.exports = {
  [SERVER_EVENTS.AI_ANALYSIS_DELETED]: async function (data) {
    const activityService = new ActivityService(data.connection);
    try {
      logger.info("creaating a ai-response activity", {_id: data?.aiResponse?._id});
      await activityService.createActivity({
        moduleType: data?.aiResponse?.source?.moduleType,
        isAutomated: true,
        iconSrc: `${process.env.ASSETS_BASE_URL}/images/system/notification/analysis.png`,
        moduleId: data?.aiResponse?.source?.module?._id,
        value: `${data?.user?.name} deleted an analysis.`,
        extraLogs: [
          {
            title: "More information",
            description: `This analysis was conducted  by ${
              data?.aiResponse?.created?.by?.name
            } on ${moment(data?.aiResponse?.createdAt).format(
              "DD/MM/YYYY HH:MM"
            )}`,
            icon: `${process.env.ASSETS_BASE_URL}/images/system/notification/sent.png`,
            image: `${process.env.ASSETS_BASE_URL}/images/system/notification/sent.png`,
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
