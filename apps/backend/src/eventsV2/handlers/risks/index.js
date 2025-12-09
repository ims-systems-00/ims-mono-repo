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
const membershipPopulation = [
  {
    path: "invitedUserId",
    select: "name email profileImageSrc",
  },
];

function register(app) {
  /**
   *
   *  Notifications
   */
  mainChannel
    .topic(SERVER_EVENTS_BUS.ESCALATE_RISK_EVENT)
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
                  title: "Risk management",
                  message: `${
                    data.payload?.risk?.escalated.by.name
                  } has escalated ${data.payload?.risk?.type} risk ${
                    data.payload?.risk?.reference
                  } ${data.payload?.risk?.title} to you${
                    data.payload?.risk?.group
                      ? ` from ${data.payload?.risk?.group?.name}`
                      : ""
                  }.`,
                  group: data.payload?.risk?.group?._id,
                  referenceType: "risks",
                  referenceModule: data.payload?.risk?._id,
                  icon: notificationIconUrl + "/escalated.png",
                  user: user._id,
                  popUpStatus: "unread",
                  params: {
                    group: data?.payload?.risk?.group?._id,
                    id: data.payload?.risk?._id,
                  },
                  screenIdentifier: `risk-management-detail`,
                  createdBy: data.payload?.risk?.escalated.by._id,
                },
                { email: true }
              );
            })
          );
        }
        // Notify all hos users

        let hosMemberships = await Membership.findByOrg(
          data.payload?.accessControl?.user?.organizationId,
          {
            role: ROLES.HEAD_OF_SERVICE,
          }
        ).populate(membershipPopulation);
        const hosUsers = hosMemberships.map((m) => m.invitedUserId);

        if (Array.isArray(hosUsers)) {
          await Promise.all(
            hosUsers.map(async (user) => {
              await notificationService.notifyV2(
                {
                  title: "Risk management",
                  message: `${
                    data.payload?.risk?.escalated.by.name
                  } has escalated ${data.payload?.risk?.type} risk ${
                    data.payload?.risk?.reference
                  } ${data.payload?.risk?.title} to you${
                    data.payload?.risk?.group
                      ? ` from ${data.payload?.risk?.group?.name}`
                      : ""
                  }.`,
                  group: data.payload?.risk?.group?._id,
                  referenceType: "risks",
                  referenceModule: data.payload?.risk?._id,
                  icon: notificationIconUrl + "/escalated.png",
                  user: user._id,
                  popUpStatus: "unread",
                  params: {
                    group: data?.payload?.risk?.group?._id,
                    id: data.payload?.risk?._id,
                  },
                  screenIdentifier: `risk-management-detail`,
                  createdBy: data.payload?.risk?.escalated.by._id,
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
    .topic(SERVER_EVENTS_BUS.NEW_RISK_OWNER_EVENT)
    .addListener(async (data) => {
      try {
        const notificationService = new Notification({
          connection: data.payload?.accessControl,
          socket: app.get("io"),
        });
        await notificationService.notifyV2(
          {
            title: "Risk management",
            message: `${data.payload?.risk?.type} risk ${data.payload?.risk?.reference} ${data.payload?.risk?.title} has been assigned to you by ${data.payload?.risk?.created.by.name}`,
            group: null,
            referenceType: "risks",
            referenceModule: data.payload?.risk?._id,
            user: data.payload?.users,
            popUpStatus: "unread",
            icon: notificationIconUrl + "/risk-assigned.png",
            params: {
              id: data.payload?.risk?._id,
            },
            screenIdentifier: `risk-management-detail`,
            createdBy: data.payload?.risk?.created.by._id,
          },
          { email: true }
        );
      } catch (error) {
        logger.error(error.message, error);
      }
    });

  mainChannel
    .topic(SERVER_EVENTS_BUS.MITIGATE_RISK_EVENT)
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
                  title: "Risk management",
                  message: `${data.payload?.risk?.type} risk ${
                    data.payload?.risk?.reference
                  } ${data.payload?.risk?.title} has been mitigated by ${
                    data.payload?.risk?.mitigated.by.name
                  }${
                    data.payload?.risk?.group?.name
                      ? ` in ${data.payload?.risk?.group?.name}`
                      : ""
                  }.`,
                  group: data.payload?.risk?.group?._id,
                  referenceType: "risks",
                  referenceModule: data.payload?.risk?._id,
                  user: user._id,
                  popUpStatus: "unread",
                  icon: notificationIconUrl + "/mitigated.png",
                  params: {
                    group: data.payload?.risk?.group?._id,
                    id: data.payload?.risk?._id,
                  },
                  screenIdentifier: `risk-management-detail`,
                  createdBy: data.payload?.risk?.mitigated.by._id,
                },
                { email: false }
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
                  title: "Risk management",
                  message: `${data.payload?.risk?.type} risk ${
                    data.payload?.risk?.reference
                  } ${data.payload?.risk?.title} has been mitigated by ${
                    data.payload?.risk?.mitigated.by.name
                  }${
                    data.payload?.risk?.group?.name
                      ? ` in ${data.payload?.risk?.group?.name}`
                      : ""
                  }.`,
                  group: data.payload?.risk?.group?._id,
                  referenceType: "risks",
                  referenceModule: data.payload?.risk?._id,
                  user: user._id,
                  popUpStatus: "unread",
                  icon: notificationIconUrl + "/mitigated.png",
                  params: {
                    group: data.payload?.risk?.group?._id,
                    id: data.payload?.risk?._id,
                  },
                  screenIdentifier: `risk-management-detail`,
                  createdBy: data.payload?.risk?.mitigated.by._id,
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
    .topic(SERVER_EVENTS_BUS.NUDGE_TO_LOOK_AT_RISK)
    .addListener(async (data) => {
      try {
        const notificationService = new Notification({
          connection: data.payload?.accessControl,
          socket: app.get("io"),
        });

        const User = user(data.payload?.accessControl);
        let users = await User.find({ _id: data?.payload?.content?.owner });

        // Notify all admin users
        if (Array.isArray(users)) {
          await Promise.all(
            users.map(async (user) => {
              await notificationService.notifyV2(
                {
                  title: "Risk management",
                  message: `${data.payload?.content?.nudged.by.name} nudged you to look at ${data.payload?.content?.type} risk ${data.payload?.content?.reference} ${data.payload?.content?.title}`,
                  group: null,
                  referenceType: "risks",
                  referenceModule: data.payload?.content?._id,
                  user: user,
                  popUpStatus: "unread",
                  icon: notificationIconUrl + "/nudge-notification.png",
                  params: {
                    group: null,
                    id: data.payload?.content?._id,
                  },
                  screenIdentifier: `risk-management-detail`,
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
   *
   * Activity
   */
  mainChannel.topic(SERVER_EVENTS.RISK_ACCEPTED).addListener(async (data) => {
    try {
      const activityService = new ActivityService(data.payload?.accessControl);
      logger.info(`"creating a risk activity", ${data?.payload?.risk?._id}`);
      await activityService.createActivity({
        moduleType: "risks",
        isAutomated: true,
        iconSrc: `${process.env.ASSETS_BASE_URL}/images/system/notification/mitigated.png`,
        moduleId: data?.payload?.risk?._id,
        value: `${data?.payload?.risk?.accepted?.by?.name} accepted this risk.`,
        extraLogs: [],
        metaInfo: {},
        createdBy: data?.payload?.risk?.accepted?.by?._id,
      });
    } catch (error) {
      logger.error(error.message, error);
    }
  });

  mainChannel
    .topic(SERVER_EVENTS.RISK_OWNERSHIP_CHANGED)
    .addListener(async (data) => {
      try {
        const activityService = new ActivityService(
          data.payload?.accessControl
        );
        logger.info(`"creating a risk activity", ${data?.payload?.risk?._id}`);
        await activityService.createActivity({
          moduleType: "risks",
          isAutomated: true,
          iconSrc: `${process.env.ASSETS_BASE_URL}/images/system/notification/ownership.png`,
          moduleId: data?.payload?.risk?._id,
          value: `${data?.payload?.user?.name} transferred the ownership to ${data?.payload?.risk?.owner?.name}.`,
          extraLogs: [
            {
              title: "Ownership history",
              description: `
Previously ${data.payload?.prevRisk.owner.name} was the owner of this risk.
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

  mainChannel.topic(SERVER_EVENTS.RISK_CREATED).addListener(async (data) => {
    try {
      const activityService = new ActivityService(data.payload?.accessControl);
      logger.info(`"creating a risk activity", ${data?.payload?.risk?._id}`);
      await activityService.createActivity({
        moduleType: "risks",
        isAutomated: true,
        iconSrc: `${process.env.ASSETS_BASE_URL}/images/system/notification/create.png`,
        moduleId: data?.payload?.risk?._id,
        value: `${data?.payload?.risk?.created?.by?.name} raised this risk.`,
        extraLogs: [],
        metaInfo: {},
        createdBy: data?.payload?.risk?.created?.by?._id,
      });
    } catch (error) {
      logger.error(error.message, error);
    }
  });

  mainChannel.topic(SERVER_EVENTS.RISK_ESCALATED).addListener(async (data) => {
    try {
      const activityService = new ActivityService(data.payload?.accessControl);
      logger.info(`"creating a risk activity", ${data?.payload?.risk?._id}`);
      await activityService.createActivity({
        moduleType: "risks",
        isAutomated: true,
        iconSrc: `${process.env.ASSETS_BASE_URL}/images/system/notification/escalated.png`,
        moduleId: data?.payload?.risk?._id,
        value: `${data?.payload?.risk?.escalated?.by?.name} escalated this risk.`,
        extraLogs: [],
        metaInfo: {},
        createdBy: data?.payload?.risk?.escalated?.by?._id,
      });
    } catch (error) {
      logger.error(error.message, error);
    }
  });

  mainChannel.topic(SERVER_EVENTS.RISK_MITIGATED).addListener(async (data) => {
    try {
      const activityService = new ActivityService(data.payload?.accessControl);
      logger.info(`"creating a risk activity", ${data?.payload?.risk?._id}`);
      await activityService.createActivity({
        moduleType: "risks",
        isAutomated: true,
        iconSrc: `${process.env.ASSETS_BASE_URL}/images/system/notification/mitigated.png`,
        moduleId: data?.payload?.risk?._id,
        value: `${data?.payload?.risk?.mitigated?.by?.name} mitigated this risk.`,
        extraLogs: [],
        metaInfo: {},
        createdBy: data?.payload?.risk?.mitigated?.by?._id,
      });
    } catch (error) {
      logger.error(error.message, error);
    }
  });

}

module.exports = { register };
