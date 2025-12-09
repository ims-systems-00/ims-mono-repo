const { mainChannel } = require("../../topic");
const { SERVER_EVENTS_BUS } = require("../../topicsName");
const Notification = require("../../../services/notification");
const moment = require("moment");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");
const notificationIconUrl = `${process.env.ASSETS_BASE_URL}/images/system/notification`;
const membership = require("../../../models/mongodb/system/membership/membership");
const { ROLES } = require("@ims-systems-00/ims-core/lib/constants");
const membershipPopulation = [
  {
    path: "invitedUserId",
    select: "name email profileImageSrc",
  },
];

function register(app) {
  mainChannel
    .topic(SERVER_EVENTS_BUS.NOTIFY_ATTENDEEDS)
    .addListener(async (data) => {
      try {
        const notificationService = new Notification({
          connection: data.payload?.accessControl,
          socket: app.get("io"),
        });
        const attendees = data.payload?.managementReview?.attendees;
        if (Array.isArray(attendees)) {
          await Promise.all(
            attendees.map(async (user) => {
              await notificationService.notifyV2(
                {
                  title: "Management review",
                  message: `You have a management review ${
                    data.payload?.managementReview?.reference || ""
                  } ${data.payload?.managementReview?.title || ""} on ${moment(
                    data.payload?.managementReview?.date
                  ).format("D/M/Y")}`,
                  group: null,
                  referenceType: "managementreviews",
                  referenceModule: data.payload?.managementReview?._id,
                  user: user._id,
                  popUpStatus: "unread",
                  icon: `${notificationIconUrl}/notification-default.png`,
                  params: {
                    group: null,
                    id: data.payload?.managementReview?._id,
                  },
                  screenIdentifier: "management-review-detail",
                  createdBy: data.payload?.managementReview?.created?.by?._id,
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
    .topic(SERVER_EVENTS_BUS.NEW_MANAGEMENT_REVIEW_EVENT)
    .addListener(async (data) => {
      try {
        const notificationService = new Notification({
          connection: data.payload?.accessControl,
          socket: app.get("io"),
        });

        const Membership = membership(data.payload?.accessControl);
        if (data?.payload?.managementReview?.privacy === "Organisational") {
          let memberships = await Membership.findByOrg(
            data.payload?.accessControl?.user?.organizationId,
            {
              role: ROLES.SUPER_ADMIN,
            }
          ).populate(membershipPopulation);
          const organisationalUsers = memberships.map((m) => m.invitedUserId);
          if (Array.isArray(organisationalUsers)) {
            await Promise.all(
              organisationalUsers.map(async (user) => {
                try {
                  await notificationService.notifyV2(
                    {
                      title: "Management review",
                      message: `You have a management review ${
                        data.payload?.managementReview?.reference || ""
                      } ${
                        data.payload?.managementReview?.title || ""
                      } on ${moment(
                        data.payload?.managementReview?.date
                      ).format("D/M/Y")}`,
                      group: null,
                      referenceType: "managementreviews",
                      referenceModule: data.payload?.managementReview?._id,
                      user: user._id,
                      popUpStatus: "read",
                      icon: `${notificationIconUrl}/notification-default.png`,
                      params: {
                        group: null,
                        id: data.payload?.managementReview?._id,
                      },
                      screenIdentifier: "management-review-detail",
                      createdBy:
                        data.payload?.managementReview?.created?.by?._id,
                    },
                    { email: false }
                  );
                } catch (error) {
                  logger.error(error.message, error);
                }
              })
            );
          }
        }
        if (
          data?.payload?.managementReview?.privacy === "Business unit" &&
          data?.payload?.managementReview?.group
        ) {
          let memberships = await Membership.findByOrg(
            data.payload?.accessControl?.user?.organizationId,
            {
              role: ROLES.HEAD_OF_SERVICE,
              groups: data?.payload?.managementReview?.group?._id,
            }
          ).populate(membershipPopulation);
          const businessUnitUsers = memberships.map((m) => m.invitedUserId);

          if (Array.isArray(businessUnitUsers)) {
            await Promise.all(
              businessUnitUsers.map(async (user) => {
                try {
                  await notificationService.notifyV2(
                    {
                      title: "Management review",
                      message: `You have a management review ${
                        data.payload?.managementReview?.reference || ""
                      } ${
                        data.payload?.managementReview?.title || ""
                      } on ${moment(
                        data.payload?.managementReview?.date
                      ).format("D/M/Y")}`,
                      group: null,
                      referenceType: "managementreviews",
                      referenceModule: data.payload?.managementReview?._id,
                      user: user._id,
                      popUpStatus: "read",
                      icon: `${notificationIconUrl}/notification-default.png`,
                      params: {
                        group: null,
                        id: data.payload?.managementReview?._id,
                      },
                      screenIdentifier: "management-review-detail",
                      createdBy:
                        data.payload?.managementReview?.created?.by?._id,
                    },
                    { email: false }
                  );
                } catch (error) {
                  logger.error(error.message, error);
                }
              })
            );
          }
        }
      } catch (error) {
        logger.error(error.message, error);
      }
    });
}

module.exports = { register };
