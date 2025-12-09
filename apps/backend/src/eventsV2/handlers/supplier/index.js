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
    .topic(SERVER_EVENTS_BUS.NEW_SUPPLIER_BUYER_EVENT)
    .addListener(async (data) => {
      try {
        const notificationService = new Notification({
          connection: data.payload?.accessControl,
          socket: app.get("io"),
        });
        let users = [data.payload?.supplier?.buyer];

        if (Array.isArray(users)) {
          await Promise.all(
            users.map(async (user) => {
              await notificationService.notifyV2(
                {
                  title: "Supplier management",
                  message: `You have been assigned as the buyer for supplier ${data.payload?.supplier?.reference} ${data.payload?.supplier?.name}.`,
                  group: null,
                  referenceType: "suppliers",
                  referenceModule: data.payload?.supplier?._id,
                  user: user._id,
                  popUpStatus: "read",
                  icon: notificationIconUrl + "/notification-default.png",
                  params: {
                    id: data._id,
                  },
                  screenIdentifier: `supplier-management-detail`,
                  createdBy: data.payload?.supplier?.created.by._id,
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
    .topic(SERVER_EVENTS_BUS.COMPLIANT_SUPPLIER_EVENT)
    .addListener(async (data) => {
      try {
        const notificationService = new Notification({
          connection: data.payload?.accessControl,
          socket: app.get("io"),
        });
        const Membership = membership(data.payload?.accessControl);
        if (!data.payload?.supplier?.group) return;
        let memberships = await Membership.findByOrg(
          data.payload?.accessControl?.user?.organizationId,
          {
            role: ROLES.SUPER_ADMIN,
          }
        ).populate(membershipPopulation);
        const users = memberships.map((m) => m.invitedUserId);
        if (!users.length) return;

        if (Array.isArray(users)) {
          await Promise.all(
            users.map(async (user) => {
              await notificationService.notifyV2(
                {
                  title: "Supplier management",
                  message: `Supplier ${data.payload?.supplier?.reference} ${
                    data.payload?.supplier?.name
                  } has become compliant${
                    data.payload?.supplier?.group?.name
                      ? ` in ${data.payload?.supplier?.group?.name}`
                      : ""
                  }.`,
                  group: data.payload?.supplier?.group?._id,
                  referenceType: "suppliers",
                  referenceModule: data.payload?.supplier?._id,
                  screenIdentifier: `supplier-management-detail`,
                  user: user._id,
                  popUpStatus: "read",
                  icon: notificationIconUrl + "/notification-default.png",
                  params: {
                    group: data.payload?.supplier?.group?._id,
                    id: data.payload?.supplier?._id,
                  },
                  createdBy: data.payload?.supplier?.created.by._id,
                },
                { email: false }
              );
            })
          );
        }


        // head of service

        let hosMemberships = await Membership.findByOrg(
          data.payload?.accessControl?.user?.organizationId,
          {
            role: ROLES.SUPER_ADMIN,
          }
        ).populate(membershipPopulation);
        const hosUsers = hosMemberships.map((m) => m.invitedUserId);
        if (!hosUsers.length) return;

        if (Array.isArray(hosUsers)) {
          await Promise.all(
            hosUsers.map(async (user) => {
              await notificationService.notifyV2(
                {
                  title: "Supplier management",
                  message: `Supplier ${data.payload?.supplier?.reference} ${
                    data.payload?.supplier?.name
                  } has become compliant${
                    data.payload?.supplier?.group?.name
                      ? ` in ${data.payload?.supplier?.group?.name}`
                      : ""
                  }.`,
                  group: data.payload?.supplier?.group?._id,
                  referenceType: "suppliers",
                  referenceModule: data.payload?.supplier?._id,
                  screenIdentifier: `supplier-management-detail`,
                  user: user._id,
                  popUpStatus: "read",
                  icon: notificationIconUrl + "/notification-default.png",
                  params: {
                    group: data.payload?.supplier?.group?._id,
                    id: data.payload?.supplier?._id,
                  },
                  createdBy: data.payload?.supplier?.created.by._id,
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
    .topic(SERVER_EVENTS_BUS.P1_INCIDENT_SUPPLIER_EVENT)
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
            role: ROLES.HEAD_OF_SERVICE,
          }
        ).populate(membershipPopulation);
        const users = memberships.map((m) => m.invitedUserId);
        if (!users.length) return;
        if (Array.isArray(users)) {
          await Promise.all(
            users.map(async (user) => {
              await notificationService.notifyV2(
                {
                  title: "Supplier management",
                  message: `P1 incident has been added to ${
                    data.payload?.supplier?.reference
                  } ${data.payload?.supplier?.name}${
                    data.payload?.supplier?.group?.name
                      ? ` in ${data.payload?.supplier?.group?.name}`
                      : ""
                  }.`,
                  group: data.payload?.supplier?.group?._id,
                  referenceType: "suppliers",
                  referenceModule: data.payload?.supplier?._id,
                  screenIdentifier: `supplier-management-detail`,
                  params: {
                    group: data.payload?.supplier?.group?._id,
                    id: data.payload?.supplier?._id,
                  },
                  user: user._id,
                  popUpStatus: "read",
                  icon: notificationIconUrl + "/notification-default.png",
                  createdBy: data.payload?.supplier?.created.by._id,
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
