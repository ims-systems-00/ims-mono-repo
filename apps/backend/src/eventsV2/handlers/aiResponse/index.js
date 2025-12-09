const { mainChannel } = require("../../topic");
const { SERVER_EVENTS_BUS } = require("../../topicsName");
const Notification = require("../../../services/notification");
const moment = require("moment");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");
const membership = require("../../../models/mongodb/system/membership/membership");
const user = require("../../../models/mongodb/system/users&auth/user");
const { ROLES } = require("@ims-systems-00/ims-core/lib/constants");
const ActivityService = require("../../../services/activity");
const { SERVER_EVENTS } = require("../../../events/constants");
const notificationIconUrl = `${process.env.ASSETS_BASE_URL}/images/system/notification`;

function register(app) {
  /**
   *
   * Activity
   */
  mainChannel
    .topic(SERVER_EVENTS.AI_ANALYSIS_CONDUCTED)
    .addListener(async (data) => {
      try {
        const activityService = new ActivityService(
          data.payload?.accessControl
        );
        logger.info(
          `"creating a ai-response activity", ${data?.payload?.aiResponse?._id}`
        );
        await activityService.createActivity({
          moduleType: data?.payload?.aiResponse?.source?.moduleType,
          isAutomated: true,
          iconSrc: `${process.env.ASSETS_BASE_URL}/images/system/notification/analysis.png`,
          moduleId: data?.payload?.aiResponse?.source?.module?._id,
          value: `${data?.payload?.aiResponse?.created?.by?.name} conducted and saved an analysis.`,
          extraLogs: [],
          metaInfo: {},
          createdBy: data?.payload?.aiResponse?.created?.by?._id,
        });
      } catch (error) {
        logger.error(error.message, error);
      }
    });

  mainChannel
    .topic(SERVER_EVENTS.AI_ANALYSIS_DELETED)
    .addListener(async (data) => {
      try {
        const activityService = new ActivityService(
          data.payload?.accessControl
        );
        logger.info(
          `"creating a ai-response activity", ${data?.payload?.aiResponse?._id}`
        );
        await activityService.createActivity({
          moduleType: data?.payload?.aiResponse?.source?.moduleType,
          isAutomated: true,
          iconSrc: `${process.env.ASSETS_BASE_URL}/images/system/notification/analysis.png`,
          moduleId: data?.payload?.aiResponse?.source?.module?._id,
          value: `${data?.payload?.user?.name} deleted an analysis.`,
          extraLogs: [
            {
              title: "More information",
              description: `This analysis was conducted  by ${
                data?.payload?.aiResponse?.created?.by?.name
              } on ${moment(data?.payload?.aiResponse?.createdAt).format(
                "DD/MM/YYYY HH:MM"
              )}`,
              icon: `${process.env.ASSETS_BASE_URL}/images/system/notification/sent.png`,
              image: `${process.env.ASSETS_BASE_URL}/images/system/notification/sent.png`,
            },
          ],
          metaInfo: {},
          createdBy: data?.payload?.user?._id,
        });
      } catch (error) {
        logger.error(error.message, error);
      }
    });
}

module.exports = { register };
