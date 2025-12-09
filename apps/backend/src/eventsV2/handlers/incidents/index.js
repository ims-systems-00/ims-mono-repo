const { mainChannel } = require("../../topic");
const { SERVER_EVENTS_BUS } = require("../../topicsName");
const Notification = require("../../../services/notification");
const moment = require("moment");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");
const notificationIconUrl = `${process.env.ASSETS_BASE_URL}/images/system/notification`;
const membership = require("../../../models/mongodb/system/membership/membership");
const user = require("../../../models/mongodb/system/users&auth/user");
const { ROLES } = require("@ims-systems-00/ims-core/lib/constants");
const { SERVER_EVENTS } = require("../../../events/constants");
const ActivityService = require("../../../services/activity");
const membershipPopulation = [
  {
    path: "invitedUserId",
    select: "name email profileImageSrc",
  },
];

function register(app) {
  mainChannel
    .topic(SERVER_EVENTS_BUS.NEW_INCIDENT_OWNER_EVENT)
    .addListener(async (data) => {
      try {
        const notificationService = new Notification({
          connection: data.payload?.accessControl,
          socket: app.get("io"),
        });
        const users = data.payload?.users;
        if (Array.isArray(users)) {
          await Promise.all(
            users.map(async (user) => {
              await notificationService.notifyV2(
                {
                  title: "Incident management",
                  message: `Incident ${data.payload?.incident?.reference} ${data.payload?.incident?.title} has been assigned to you by ${data.payload?.incident?.created.by.name}`,
                  group: data.payload?.incident?.group?._id,
                  referenceType: "incidents",
                  referenceModule: data.payload?.incident?._id,
                  user: user,
                  popUpStatus: "unread",
                  icon: notificationIconUrl + "/incident-assigned.png",
                  params: {
                    group: data.payload?.incident?.group?._id,
                    id: data.payload?.incident?._id,
                  },
                  screenIdentifier: "incident-management-detail",
                  createdBy: data.payload?.incident?.created.by._id,
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
    .topic(SERVER_EVENTS_BUS.ESCALATE_INCIDENT_EVENT)
    .addListener(async (data) => {
      try {
        const notificationService = new Notification({
          connection: data.payload?.accessControl,
          socket: app.get("io"),
        });

        const Membership = membership(data.payload?.accessControl);

        let adminMemberships = await Membership.findByOrg(
          data.payload?.accessControl?.user?.organizationId,
          {
            role: ROLES.SUPER_ADMIN,
          }
        ).populate(membershipPopulation);
        const adminUsers = adminMemberships.map((m) => m.invitedUserId);

        // Notify all admin users
        if (Array.isArray(adminUsers)) {
          await Promise.all(
            adminUsers.map(async (user) => {
              await notificationService.notifyV2(
                {
                  title: "Incident management",
                  message: `${
                    data.payload?.incident?.escalated.by.name
                  } has escalated incident ${
                    data.payload?.incident?.reference
                  } ${data.payload?.incident?.title} to you${
                    data.payload?.incident?.group?.name
                      ? ` from ${data.payload?.incident?.group?.name}`
                      : ""
                  }.`,
                  group: data.payload?.incident?.group?._id,
                  referenceType: "incidents",
                  referenceModule: data.payload?.incident?._id,
                  user: user?._id,
                  popUpStatus: "unread",
                  icon: notificationIconUrl + "/escalated.png",
                  params: {
                    group: data.payload?.incident?.group?._id,
                    id: data.payload?.incident?._id,
                  },
                  screenIdentifier: "incident-management-detail",
                  createdBy: data.payload?.incident?.escalated.by._id,
                },
                { email: true }
              );
            })
          );
        }

        let hosMemberships = await Membership.findByOrg(
          data.payload?.accessControl?.user?.organizationId,
          {
            role: ROLES.HEAD_OF_SERVICE,
          }
        ).populate(membershipPopulation);
        const hosUsers = hosMemberships.map((m) => m.invitedUserId);

        // Notify all hos users
        if (Array.isArray(hosUsers)) {
          await Promise.all(
            hosUsers.map(async (user) => {
              await notificationService.notifyV2(
                {
                  title: "Incident management",
                  message: `${
                    data.payload?.incident?.escalated.by.name
                  } has escalated incident ${
                    data.payload?.incident?.reference
                  } ${data.payload?.incident?.title}${
                    data.payload?.incident?.group?.name
                      ? ` from ${data.payload?.incident?.group?.name}`
                      : ""
                  }.`,
                  group: data.payload?.incident?.group?._id,
                  referenceType: "incidents",
                  referenceModule: data.payload?.incident?._id,
                  user: user._id,
                  popUpStatus: "unread",
                  icon: notificationIconUrl + "/escalated.png",
                  params: {
                    group: data.payload?.incident?.group?._id,
                    id: data.payload?.incident?._id,
                  },
                  screenIdentifier: "incident-management-detail",
                  createdBy: data.payload?.incident?.escalated.by._id,
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
    .topic(SERVER_EVENTS_BUS.RESOLVE_INCIDENT_EVENT)
    .addListener(async (data) => {
      try {
        const notificationService = new Notification({
          connection: data.payload?.accessControl,
          socket: app.get("io"),
        });
        const Membership = membership(data.payload?.accessControl);
        let adminMemberships = await Membership.findByOrg(
          data.payload?.accessControl?.user?.organizationId,
          {
            role: ROLES.SUPER_ADMIN,
          }
        ).populate(membershipPopulation);
        const adminUsers = adminMemberships.map((m) => m.invitedUserId);
        // Notify all admin users

        if (Array.isArray(adminUsers)) {
          await Promise.all(
            adminUsers.map(async (user) => {
              await notificationService.notifyV2(
                {
                  title: "Incident management",
                  message: `${data.payload?.incident?.reference} ${
                    data.payload?.incident?.title
                  } has been resolved by ${
                    data.payload?.incident?.resolved.by.name
                  }${
                    data.payload?.incident?.group?.name
                      ? ` in ${data.payload?.incident?.group?.name}`
                      : ""
                  }.`,
                  group: data.payload?.incident?.group?._id,
                  referenceType: "incidents",
                  referenceModule: data.payload?.incident?._id,
                  user: user._id,
                  popUpStatus: "unread",
                  icon: notificationIconUrl + "/notification-default.png",
                  params: {
                    group: data.payload?.incident?.group?._id,
                    id: data.payload?.incident?._id,
                  },
                  screenIdentifier: "incident-management-detail",
                  createdBy: data.payload?.incident?.resolved.by._id,
                },
                { email: false }
              );
            })
          );
        }

        // Notify all hos users

        let hosMemberships = await Membership.findByOrg(
          data.payload?.accessControl?.user?.organizationId,
          {
            $or: [
              { role: ROLES.HEAD_OF_SERVICE },
              {
                invitedUserId: {
                  $in: [
                    data.payload?.incident?.created.by?._id,
                    data.payload?.incident?.owner?._id,
                  ],
                },
              },
            ],
          }
        ).populate(membershipPopulation);
        const hosUsers = hosMemberships.map((m) => m.invitedUserId);

        if (Array.isArray(hosUsers)) {
          await Promise.all(
            hosUsers.map(async (user) => {
              await notificationService.notifyV2(
                {
                  title: "Incident management",
                  message: `${data.payload?.incident?.reference} ${data.payload?.incident?.title} has been resolved by ${data.payload?.incident?.resolved.by.name}`,
                  group: data.payload?.incident?.group?._id,
                  referenceType: "incidents",
                  referenceModule: data.payload?.incident?._id,
                  user: user._id,
                  popUpStatus: "unread",
                  icon: notificationIconUrl + "/notification-default.png",
                  params: {
                    group: data.payload?.incident?.group?._id,
                    id: data.payload?.incident?._id,
                  },
                  screenIdentifier: "incident-management-detail",
                  createdBy: data.payload?.incident?.resolved.by._id,
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
    .topic(SERVER_EVENTS_BUS.NUDGE_TO_LOOK_AT_INCIDENT)
    .addListener(async (data) => {
      try {
        const notificationService = new Notification({
          connection: data.payload?.accessControl,
          socket: app.get("io"),
        });
        const User = user(data.payload?.accessControl);

        let users = await User.find({
          _id: data?.payload?.content?.owner,
        }).select("name email");

        if (Array.isArray(users)) {
          await Promise.all(
            users.map(async (user) => {
              await notificationService.notifyV2(
                {
                  title: "Incident management",
                  message: `${data.payload?.content?.nudged.by.name} nudged you to look at incident ${data.payload?.content?.reference} ${data.payload?.content?.title}`,
                  group: null,
                  referenceType: "incidents",
                  referenceModule: data.payload?.content?._id,
                  user: user,
                  popUpStatus: "unread",
                  icon: notificationIconUrl + "/nudge-notification.png",
                  params: {
                    group: null,
                    id: data.payload?.content?._id,
                  },
                  screenIdentifier: `incident-management-detail`,
                  createdBy: data.payload?.content?.nudged.by._id,
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

  /**
   * Activity
   */
  mainChannel
    .topic(SERVER_EVENTS.INCIDENT_CREATED)
    .addListener(async (data) => {
      try {
        const activityService = new ActivityService(
          data.payload?.accessControl
        );
        logger.info("creating a incident activity", {
          _id: data?.payload?.incident?._id,
        });
        await activityService.createActivity({
          moduleType: "incidents",
          isAutomated: true,
          iconSrc: `${process.env.ASSETS_BASE_URL}/images/system/notification/create.png`,
          moduleId: data?.payload?.incident?._id,
          value: `${data?.payload?.incident?.created?.by?.name} raised this incident.`,
          extraLogs: [],
          metaInfo: {},
          createdBy: data?.payload?.incident?.created?.by?._id,
        });
      } catch (error) {
        logger.error(error.message, error);
      }
    });

  mainChannel
    .topic(SERVER_EVENTS.INCIDENT_ESCALATED)
    .addListener(async (data) => {
      try {
        const activityService = new ActivityService(
          data.payload?.accessControl
        );
        logger.info("creating a incident activity", {
          _id: data?.payload?.incident?._id,
        });
        await activityService.createActivity({
          moduleType: "incidents",
          isAutomated: true,
          iconSrc: `${process.env.ASSETS_BASE_URL}/images/system/notification/escalated.png`,
          moduleId: data?.payload?.incident?._id,
          value: `${data?.payload?.incident?.escalated?.by?.name} escalated this incident.`,
          extraLogs: [],
          metaInfo: {},
          createdBy: data?.payload?.incident?.escalated?.by?._id,
        });
      } catch (error) {
        logger.error(error.message, error);
      }
    });

  mainChannel
    .topic(SERVER_EVENTS.INCIDENT_OWNERSHIP_CHANGED)
    .addListener(async (data) => {
      try {
        const activityService = new ActivityService(
          data.payload?.accessControl
        );
        logger.info("creating a incident activity", {
          _id: data?.payload?.incident?._id,
        });
        await activityService.createActivity({
          moduleType: "incidents",
          isAutomated: true,
          iconSrc: `${process.env.ASSETS_BASE_URL}/images/system/notification/ownership.png`,
          moduleId: data?.payload?.incident?._id,
          value: `${data?.payload?.user?.name} changed the ownership for this incident to ${data?.payload?.incident?.owner?.name}.`,
          extraLogs: [
            {
              title: "Ownership history",
              description: `
  Previously ${data.payload?.prevIncident.owner.name} was the owner of this incident.
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
    .topic(SERVER_EVENTS.INCIDENT_RESOLVED)
    .addListener(async (data) => {
      try {
        const activityService = new ActivityService(
          data.payload?.accessControl
        );
        logger.info("creating a incident activity", {
          _id: data?.payload?.incident?._id,
        });
        await activityService.createActivity({
          moduleType: "incidents",
          isAutomated: true,
          iconSrc: `${process.env.ASSETS_BASE_URL}/images/system/notification/resolved.png`,
          moduleId: data?.payload?.incident?._id,
          value: `${data?.payload?.incident?.resolved?.by?.name} resolved this incident.`,
          extraLogs: [],
          metaInfo: {},
          createdBy: data?.payload?.incident?.resolved?.by?._id,
        });
      } catch (error) {
        logger.error(error.message, error);
      }
    });
  
}

module.exports = { register };
