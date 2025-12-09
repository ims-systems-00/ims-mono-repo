const { mainChannel } = require("../../topic");
const { SERVER_EVENTS_BUS } = require("../../topicsName");
const Notification = require("../../../services/notification");
const moment = require("moment");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");
const membership = require("../../../models/mongodb/system/membership/membership");
const { ROLES } = require("@ims-systems-00/ims-core/lib/constants");
const notificationIconUrl = `${process.env.ASSETS_BASE_URL}/images/system/notification`;
const membershipPopulation = [
  {
    path: "invitedUserId",
    select: "name email profileImageSrc",
  },
];

function register(app) {
  mainChannel
    .topic(SERVER_EVENTS_BUS.NEW_KPI_EVENT)
    .addListener(async (data) => {
      try {
        const notificationService = new Notification({
          connection: data.payload?.accessControl,
          socket: app.get("io"),
        });
        const Membership = membership(data.payload?.accessControl);
        if (!data.payload?.kpiObjective?.group) return;
        let memberships = await Membership.findByOrg(
          data.payload?.accessControl?.user?.organizationId,
          {
            role: ROLES.HEAD_OF_SERVICE,
            groups: data.payload?.kpiObjective?.group._id,
          }
        ).populate(membershipPopulation);
        const users = memberships.map((m) => m.invitedUserId);
        if (!users.length) return;
        // Notify all hos users
        if (Array.isArray(users)) {
          await Promise.all(
            users.map(async (user) => {
              await notificationService.notifyV2(
                {
                  title: "New KPI/Objectives",
                  message: `A new kpi has been assigned to ${data.group?.name}`,
                  group: data.payload?.kpiObjective?.group?._id,
                  referenceType: "kpiobjectives",
                  referenceModule: data.payload?.kpiObjective?._id,
                  user: user._id,
                  popUpStatus: "read",
                  icon: notificationIconUrl + "/notification-default.png",
                  params: {
                    group: data.payload?.kpiObjective?.group?._id,
                    id: data.payload?.kpiObjective?._id,
                  },
                  screenIdentifier: "kpi-objective-detail",
                  createdBy: data.payload?.kpiObjective?.created.by._id,
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
