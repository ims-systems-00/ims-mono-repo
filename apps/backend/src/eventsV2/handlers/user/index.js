const { mainChannel } = require("../../topic");
const { SERVER_EVENTS_BUS } = require("../../topicsName");
const Notification = require("../../../services/notification");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");
const notificationIconUrl = `${process.env.ASSETS_BASE_URL}/images/system/notification`;
const membership = require("../../../models/mongodb/system/membership/membership");
const { ROLES } = require("@ims-systems-00/ims-core/lib/constants");
const moment = require("moment");
const {
  moduleToScreenMap,
} = require("../../../services/triggers/moduleToScreenMap");

function register(app) {
  mainChannel
    .topic(SERVER_EVENTS_BUS.USER_MENTIONED_EVENT)
    .addListener(async (data) => {
      try {
        const notificationService = new Notification({
          connection: data.payload?.accessControl,
          socket: app.get("io"),
        });
        const tempBadParamsFix =
          data.payload?.notificationData?.notimoduleType === "documenttrees"
            ? {
                id: data.payload?.notificationData?.module.repository,
                nodeId: data.payload?.notificationData?.module._id,
              }
            : {};

        let users = data.payload?.notificationData?.mentionedUsers || [];

        if (Array.isArray(users)) {
          await Promise.all(
            users.map(async (user) => {
              await notificationService.notifyV2(
                {
                  title: "Mentions",
                  message: `${
                    data.payload?.notificationData?.user.name
                  } mentioned you in a ${
                    data.payload?.notificationData?.place?.alias
                  } in ${data.payload?.notificationData?.module?.reference} ${
                    data.payload?.notificationData?.module.title ||
                    data.payload?.notificationData?.module.name ||
                    ""
                  }`,
                  group: null,
                  referenceType: data.payload?.notificationData?.moduleType,
                  referenceModule: data.payload?.notificationData?.module._id,
                  /**
                   * TODO: really bad way to handle this mention notifications in this event
                   * in future need robust way to detect screens or links
                   */
                  screenIdentifier:
                    moduleToScreenMap[
                      (["audits"].includes(
                        data.payload?.notificationData?.moduleType
                      )
                        ? data.payload?.notificationData?.module.type?.toLowerCase()
                        : "") + data.payload?.notificationData?.moduleType
                    ] || ``,
                  params: {
                    id: data.payload?.notificationData?.module._id,
                    ...tempBadParamsFix,
                  },
                  user: user._id,
                  popUpStatus: "unread",
                  icon: notificationIconUrl + "/notification-default.png",
                  createdBy: data.payload?.notificationData?.user?._id,
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

  mainChannel
    .topic(SERVER_EVENTS_BUS.REFERETIAL_INTEGRITY_HANDLE_COMPLETE_EVENT)
    .addListener(async (data) => {
      try {
        const notificationService = new Notification({
          connection: data.payload?.accessControl,
          socket: app.get("io"),
        });
        let users = [
          {
            _id: data.payload?.initiator._id,
            name: data.payload?.initiator.name,
          },
        ];

        if (Array.isArray(users)) {
          await Promise.all(
            users.map(async (user) => {
              await notificationService.notifyV2(
                {
                  title: "Data integrity checks",
                  message: `Data ownership for ${data.payload?.sourceUser.name} has been transfered to ${data.payload?.destinationUser.name} safely. You can now delete the account ${data.payload?.sourceUser.name}.`,
                  group: null,
                  referenceType: "",
                  referenceModule: null,
                  screenIdentifier: ``,
                  params: {},
                  user: user._id,
                  popUpStatus: "unread",
                  icon: notificationIconUrl + "/notification-default.png",
                  createdBy: data.payload?.initiator?._id,
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

  mainChannel
    .topic(SERVER_EVENTS_BUS.DATA_OWNERSHIP_TRANSFERED_EVENT)
    .addListener(async (data) => {
      try {
        const notificationService = new Notification({
          connection: data.payload?.accessControl,
          socket: app.get("io"),
        });
        let users = [
          {
            _id: data.payload?.destinationUser._id,
            name: data.payload?.destinationUser.name,
          },
        ];

        if (Array.isArray(users)) {
          await Promise.all(
            users.map(async (user) => {
              await notificationService.notifyV2(
                {
                  title: "Data integrity checks",
                  message: `${data.payload?.initiator.name} has transferred the ownership of all data from ${data.payload?.sourceUser.name} to you.`,
                  group: null,
                  referenceType: "",
                  referenceModule: null,
                  screenIdentifier: ``,
                  params: {},
                  user: user._id,
                  popUpStatus: "unread",
                  icon: notificationIconUrl + "/notification-default.png",
                  createdBy: data.payload?.initiator?._id,
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
