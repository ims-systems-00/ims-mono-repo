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
    .topic(SERVER_EVENTS.ATTACHMENT_ADDED)
    .addListener(async (data) => {
      try {
        const activityService = new ActivityService(
          data?.payload?.accessControl
        );
        await activityService.createActivity({
          moduleType: data?.payload?.moduleType,
          isAutomated: true,
          iconSrc: `${process.env.ASSETS_BASE_URL}/images/system/notification/document-uploaded.png`,
          moduleId: data?.payload?.module?._id,
          value: `${data?.payload?.user?.name} added attachement(s).`,
          extraLogs: [
            {
              title: "Attachment details",
              description: `
${data?.payload?.attachments
  ?.map((attachment) => {
    return attachment.Name;
  })
  .join("\n")}
`,
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
  mainChannel
    .topic(SERVER_EVENTS.CONTROL_BECAME_COMPLIANT)
    .addListener(async (data) => {
      try {
        const activityService = new ActivityService(
          data?.payload?.accessControl
        );
        await activityService.createActivity({
          moduleType: "controlstatuses",
          isAutomated: true,
          iconSrc: `${process.env.ASSETS_BASE_URL}/images/system/notification/goal.png`,
          moduleId: data?.payload?.control?._id,
          value: `Control has been selected and implemented.`,
          extraLogs: [
            {
              title: "System logs",
              description: `${data?.payload?.message}`,
              icon: `${process.env.ASSETS_BASE_URL}/images/system/notification/goal.png`,
              image: `${process.env.ASSETS_BASE_URL}/images/system/notification/goal.png`,
            },
          ],
          metaInfo: {},
          createdBy: data?.payload?.user?._id,
        });
      } catch (error) {
        logger.error(error.message, error);
      }
    });
  mainChannel.topic(SERVER_EVENTS.NUDGED_A_PERSON).addListener(async (data) => {
    try {
      const activityService = new ActivityService(data?.payload?.accessControl);
      await activityService.createActivity({
        moduleType: data?.payload?.moduleType,
        isAutomated: true,
        iconSrc: `${process.env.ASSETS_BASE_URL}/images/system/notification/nudge-notification.png`,
        moduleId: data?.payload?.module?._id,
        value: `${data?.payload?.user?.name} nudged the owner.`,
        extraLogs: [],
        metaInfo: {},
        createdBy: data?.payload?.user?._id,
      });
    } catch (error) {
      logger.error(error.message, error);
    }
  });
}

module.exports = { register };
