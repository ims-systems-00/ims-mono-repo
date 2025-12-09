const { mainChannel } = require("../../topic");
const { SERVER_EVENTS_BUS } = require("../../topicsName");
const Notification = require("../../../services/notification");
const ActivityService = require("../../../services/activity");
const moment = require("moment");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");
const notificationIconUrl = `${process.env.ASSETS_BASE_URL}/images/system/notification`;
function register(app) {
  mainChannel
    .topic(SERVER_EVENTS_BUS.NEW_AUDIT_OWNER_EVENT)
    .addListener(async (data) => {
      try {
        const notificationService = new Notification({
          connection: data.payload?.accessControl,
          socket: app.get("io"),
        });

        const users = data?.payload?.users;
        if (Array.isArray(users)) {
          await Promise.all(
            users.map(async (user) => {
              await notificationService.notifyV2(
                {
                  title: "Audit",
                  message: `${
                    data.payload?.audit?.group?.name ||
                    data?.payload?.accessControl?.user?.organizationName
                  } has been scheduled in for ${
                    data.payload?.audit?.reference
                  } ${
                    data.payload?.audit?.title
                  } ${data.payload?.audit?.type.toLowerCase()} audit on ${moment(
                    data.payload?.audit?.startDate
                  ).format("D/M/Y")} ${data.payload?.audit?.time}`,
                  group: data.payload?.audit?.group?._id,
                  referenceType: "audits",
                  referenceModule: data.payload?.audit?._id,
                  user: user._id,
                  popUpStatus: "unread",
                  icon: notificationIconUrl + "/notification-default.png",
                  params: {
                    group: data.payload?.audit?.group?._id,
                    id: data.payload?.audit?._id,
                  },
                  screenIdentifier: !data.payload?.audit?.isExternal
                    ? "internal-audit-detail"
                    : "external-audit-detail",
                  createdBy: data.payload?.audit?.created.by._id,
                },
                { email: true }
              );
            })
          );
        }
      } catch (error) {
        logger.error(error.message, error);
      }
    });
}

module.exports = { register };
