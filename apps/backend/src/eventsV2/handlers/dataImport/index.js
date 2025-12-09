const { mainChannel } = require("../../topic");
const { SERVER_EVENTS_BUS } = require("../../topicsName");
const Notification = require("../../../services/notification");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");
const notificationIconUrl = `${process.env.ASSETS_BASE_URL}/images/system/notification`;
const membership = require("../../../models/mongodb/system/membership/membership");
const { ROLES } = require("@ims-systems-00/ims-core/lib/constants");
const moment = require("moment");
const membershipPopulation = [
  {
    path: "invitedUserId",
    select: "name email profileImageSrc",
  },
];
function register(app) {
  mainChannel
    .topic(SERVER_EVENTS_BUS.DATA_IMPORT_INITIAL_EVENT)
    .addListener(async (data) => {
      try {
        const notificationService = new Notification({
          connection: data.payload?.accessControl,
          socket: app.get("io"),
        });
        const Membership = membership(data.payload?.accessControl);
        let memberships = await Membership.findByOrg(
          data.payload?.accessControl?.user?.organizationId,
          {
            role: ROLES.SUPER_ADMIN,
          }
        ).populate(membershipPopulation);
        const users = memberships.map((m) => m.invitedUserId);

        if (Array.isArray(users)) {
          await Promise.all(
            users.map(async (user) => {
              await notificationService.notifyV2(
                {
                  title: "Import Dataset",
                  message: `${
                    data.payload?.user?.name
                  } initiated a data import process into '${
                    data.payload?.module
                  }' module on ${moment(new Date()).format(
                    "DD/MM/YYYY HH:mm"
                  )}.`,
                  group: null,
                  referenceType: "",
                  referenceModule: null,
                  screenIdentifier: ``,
                  params: {},
                  user: user._id,
                  popUpStatus: "unread",
                  icon: notificationIconUrl + "/notification-default.png",
                  createdBy: data.payload?.user?._id,
                },
                { email: false }
              );
            })
          );
        }
      } catch (error) {
        logger.error(error.message, error);
      }
    });

  mainChannel
    .topic(SERVER_EVENTS_BUS.DATA_IMPORT_COMPLETE_EVENT)
    .addListener(async (data) => {
      try {
        const notificationService = new Notification({
          connection: data.payload?.accessControl,
          socket: app.get("io"),
        });
        let users = [data.payload?.user];

        if (Array.isArray(users)) {
          await Promise.all(
            users.map(async (user) => {
              await notificationService.notifyV2(
                {
                  title: "Import Dataset",
                  message: `We have successfully imported your datasets into the system that was started at ${moment(
                    data.payload?.startTime
                  ).format("DD/MM/YYYY HH:mm")}. Import duration ${
                    data.durationString
                  }`,
                  group: null,
                  referenceType: "",
                  referenceModule: null,
                  screenIdentifier: ``,
                  params: {},
                  user: user._id,
                  popUpStatus: "unread",
                  icon: notificationIconUrl + "/notification-default.png",
                  createdBy: data.payload?.user?._id,
                },
                { email: false }
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
