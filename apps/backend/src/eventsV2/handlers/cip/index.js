const { mainChannel } = require("../../topic");
const { SERVER_EVENTS_BUS } = require("../../topicsName");
const Notification = require("../../../services/notification");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");
const notificationIconUrl = `${process.env.ASSETS_BASE_URL}/images/system/notification`;
const membership = require("../../../models/mongodb/system/membership/membership");
const { ROLES } = require("@ims-systems-00/ims-core/lib/constants");
const user = require("../../../models/mongodb/system/users&auth/user");
const ActivityService = require("../../../services/activity");
const { SERVER_EVENTS } = require("../../../events/constants");

const membershipPopulation = [
  {
    path: "invitedUserId",
    select: "name email profileImageSrc",
  },
];

function register(app) {
  mainChannel
    .topic(SERVER_EVENTS_BUS.NEW_OFI_OWNER_EVENT)
    .addListener(async (data) => {
      try {
        const notificationService = new Notification({
          connection: data.payload?.accessControl,
          socket: app.get("io"),
        });

        let users = [data.payload?.cip?.owner];
        if (Array.isArray(users)) {
          await Promise.all(
            users.map(async (user) => {
              await notificationService.notifyV2(
                {
                  title: "Opportunity for improvement",
                  message: `You have been assigned ${
                    data.payload?.cip?.reference
                  } ${data.payload?.cip?.title} by ${
                    data.payload?.cip?.created.by.name
                  }${
                    data.payload?.cip?.group?.name
                      ? ` in ${data.payload?.cip?.group?.name}`
                      : ""
                  }.`,
                  group: data.payload?.cip?.group?._id,
                  referenceType: "cips",
                  referenceModule: data.payload?.cip?._id,
                  screenIdentifier: "continual-improvement-plan-detail",
                  params: {
                    group: data.payload?.cip?.group?._id,
                    id: data.payload?.cip?._id,
                  },
                  user: user,
                  popUpStatus: "unread",
                  icon: notificationIconUrl + "/notification-default.png",
                  createdBy: data.payload?.cip?.created.by._id,
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
    .topic(SERVER_EVENTS_BUS.OFI_IMPLEMENTED_EVENT)
    .addListener(async (data) => {
      try {
        const notificationService = new Notification({
          connection: data.payload?.accessControl,
          socket: app.get("io"),
        });
        const Membership = membership(data.payload?.accessControl);

        let hosMemberships = await Membership.findByOrg(
          data.payload?.accessControl?.user?.organizationId,
          {
            role: ROLES.HEAD_OF_SERVICE,
          }
        ).populate(membershipPopulation);
        const users = hosMemberships.map((m) => m.invitedUserId);

        if (Array.isArray(users)) {
          await Promise.all(
            users.map(async (user) => {
              await notificationService.notifyV2(
                {
                  title: "Opportunity for improvement",
                  message: `${data.payload?.cip?.reference} ${
                    data.payload?.cip?.title
                  } has been implmeneted by ${
                    data.payload?.cip?.implemented.by.name
                  }${
                    data.payload?.cip?.group?.name
                      ? ` from ${data.payload?.cip?.group?.name}`
                      : ""
                  }.`,
                  group: data.payload?.cip?.group?._id,
                  referenceType: "cips",
                  referenceModule: data.payload?.cip?._id,
                  screenIdentifier: "continual-improvement-plan-detail",
                  params: {
                    group: data.payload?.cip?.group?._id,
                    id: data.payload?.cip?._id,
                  },
                  user: user,
                  popUpStatus: "unread",
                  icon: notificationIconUrl + "/notification-default.png",
                  createdBy: data.payload?.cip?.implemented.by._id,
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
    .topic(SERVER_EVENTS_BUS.NUDGE_TO_LOOK_AT_CIP)
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
                  title: "Opportunity for improvement",
                  message: `${data.payload?.content?.nudged.by.name} nudged you to look at ${data.payload?.content?.reference} ${data.payload?.content?.title}`,
                  group: null,
                  referenceType: "cips",
                  referenceModule: data.payload?.content?._id,
                  user: user,
                  popUpStatus: "unread",
                  icon: notificationIconUrl + "/nudge-notification.png",
                  params: {
                    group: null,
                    id: data.payload?.content?._id,
                  },
                  screenIdentifier: `continual-improvement-plan-detail`,
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

  mainChannel.topic(SERVER_EVENTS.OFI_CREATED).addListener(async (data) => {
    try {
      const activityService = new ActivityService(data.payload?.accessControl);
      logger.info("creating a cip activity", { _id: data?.payload?.cip?._id });
      await activityService.createActivity({
        moduleType: "cips",
        isAutomated: true,
        iconSrc: `${process.env.ASSETS_BASE_URL}/images/system/notification/create.png`,
        moduleId: data?.payload?.cip?._id,
        value: `${data?.payload?.cip?.created?.by?.name} raised this OFI.`,
        extraLogs: [],
        metaInfo: {},
        createdBy: data?.payload?.cip?.created?.by?._id,
      });
    } catch (error) {
      logger.error(error.message, error);
    }
  });
  mainChannel
    .topic(SERVER_EVENTS_BUS.OFI_IMPLEMENTED_EVENT)
    .addListener(async (data) => {
      try {
        const activityService = new ActivityService(
          data.payload?.accessControl
        );
        logger.info("creating a cip activity", {
          _id: data?.payload?.cip?._id,
        });
        await activityService.createActivity({
          moduleType: "cips",
          isAutomated: true,
          iconSrc: `${process.env.ASSETS_BASE_URL}/images/system/notification/resolved.png`,
          moduleId: data?.payload?.cip?._id,
          value: `${data?.payload?.cip?.implemented?.by?.name} implemented this OFI.`,
          extraLogs: [],
          metaInfo: {},
          createdBy: data?.payload?.cip?.implemented?.by?._id,
        });
      } catch (error) {
        logger.error(error.message, error);
      }
    });
  mainChannel.topic(SERVER_EVENTS.OFI_IN_PROGRESS).addListener(async (data) => {
    try {
      const activityService = new ActivityService(data.payload?.accessControl);
      logger.info("creating a cip activity", { _id: data?.payload?.cip?._id });
      await activityService.createActivity({
        moduleType: "cips",
        isAutomated: true,
        iconSrc: `${process.env.ASSETS_BASE_URL}/images/system/notification/escalated.png`,
        moduleId: data?.payload?.cip?._id,
        value: `This OFI is now in progress.`,
        extraLogs: [],
        metaInfo: {},
        createdBy: data?.payload?.cip?.created?.by?._id,
      });
    } catch (error) {
      logger.error(error.message, error);
    }
  });
  mainChannel
    .topic(SERVER_EVENTS.OFI_OWNERSHIP_CHANGED)
    .addListener(async (data) => {
      try {
        const activityService = new ActivityService(
          data.payload?.accessControl
        );
        logger.info("creating a cip activity", {
          _id: data?.payload?.cip?._id,
        });
        await activityService.createActivity({
          moduleType: "cips",
          isAutomated: true,
          iconSrc: `${process.env.ASSETS_BASE_URL}/images/system/notification/ownership.png`,
          moduleId: data?.payload?.cip?._id,
          value: `${data?.payload?.user?.name} changed the ownership for this OFI to ${data?.payload?.cip?.owner?.name}.`,
          extraLogs: [
            {
              title: "Ownership history",
              description: `
Previously ${data.payload?.prevCip.owner.name} was the owner of this OFI.
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
}

module.exports = { register };
