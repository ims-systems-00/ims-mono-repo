const { mainChannel } = require("../../topic");
const { SERVER_EVENTS_BUS } = require("../../topicsName");
const Notification = require("../../../services/notification");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");
const notificationIconUrl = `${process.env.ASSETS_BASE_URL}/images/system/notification`;
const membership = require("../../../models/mongodb/system/membership/membership");
const { ROLES } = require("@ims-systems-00/ims-core/lib/constants");
const {
  moduleToScreenMap,
} = require("../../../services/triggers/moduleToScreenMap");
const { SERVER_EVENTS } = require("../../../events/constants");
const ActivityService = require("../../../services/activity");
const complianceAutomationQueue = require("../../../schedules/queues/complianceAutomation.queue");
const {
  ComplianceToolCRUDOps,
} = require("../../../services/complianceManager");

const membershipPopulation = [
  {
    path: "invitedUserId",
    select: "name email profileImageSrc",
  },
];

function register(app) {
  mainChannel
    .topic(SERVER_EVENTS_BUS.CONTROL_COMPLIANCE_UPDATES)
    .addListener(async (data) => {
      try {
        const notificationService = new Notification({
          connection: data.payload?.accessControl,
          socket: app.get("io"),
        });
        const Membership = membership(data.payload?.accessControl);
        let memberships = await Membership.findByOrg(
          data.payload?.accessControl?.user?.organizationId,
          {}
        ).populate(membershipPopulation);
        const users = memberships.map((m) => m.invitedUserId);

        if (Array.isArray(users)) {
          await Promise.all(
            users.map(async (user) => {
              await notificationService.notifyV2(
                {
                  title: "Compliance",
                  message: `Your organisation has now selected and implemented ${data.payload?.control?.name} - Control ${data.payload?.control?.clause}.`,
                  group: null,
                  referenceType: "",
                  referenceModule: null,
                  screenIdentifier: "control-status-detail",
                  params: {
                    id: data?.payload?.control?._id,
                  },
                  user: user._id,
                  popUpStatus: "read",
                  icon: notificationIconUrl + "/notification-default.png",
                  createdBy: data.payload?.control?.updated?.by?._id,
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
    .topic(SERVER_EVENTS.CHECKOUT_POTENTIAL_COMPLAINCE)
    .addListener(async (data) => {
      try {
        complianceAutomationQueue.produce({
          accessControl: data?.payload?.accessControl,
          moduleType: data?.payload?.moduleType,
          user: data?.payload?.user,
        });
      } catch (error) {
        logger.error(error.message, error);
      }
    });

  mainChannel
    .topic(SERVER_EVENTS.CONTROL_HAS_BEEN_LINKED_TO_MODULE)
    .addListener(async (data) => {
      const activityService = new ActivityService(data.payload?.accessControl);
      const complianceToolCrudOps = new ComplianceToolCRUDOps(
        data.payload?.accessControl
      );
      try {
        const controls = await complianceToolCrudOps.getComplainceTool(
          { _id: { $in: data.payload?.controls || [] } },
          { limit: 50 }
        );
        logger.info("linking a control", {
          moduleType: data?.payload?.moduleType,
          _id: data?.payload?.module?._id,
        });
        await activityService.createActivity({
          moduleType: data?.payload?.moduleType,
          isAutomated: true,
          iconSrc: `${process.env.ASSETS_BASE_URL}/images/system/notification/link.png`,
          moduleId: data?.payload?.module?._id,
          value: `${data?.payload?.user?.name} linked compliance control(s).`,
          extraLogs: [
            {
              title: "Linked control(s)",
              description: `
  ${controls.compliance
    ?.map((control) => {
      return `${control.name} ${control?.control?.clause}: ${control?.control?.title}\n`;
    })
    .join("\n")}
  `,
              icon: `${process.env.ASSETS_BASE_URL}/images/system/notification/link-2.png`,
              image: `${process.env.ASSETS_BASE_URL}/images/system/notification/link-2.png`,
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
    .topic(SERVER_EVENTS.CONTROL_HAS_BEEN_UNLINKED_FROM_MODULE)
    .addListener(async (data) => {
      const activityService = new ActivityService(data.payload?.accessControl);
      const complianceToolCrudOps = new ComplianceToolCRUDOps(
        data.payload?.accessControl
      );
      try {
        const controls = await complianceToolCrudOps.getComplainceTool(
          { _id: { $in: data.payload?.controls || [] } },
          { limit: 50 }
        );
        logger.info("unlinking a control", {
          moduleType: data?.payload?.moduleType,
          _id: data?.payload?.module?._id,
        });
        await activityService.createActivity({
          moduleType: data?.payload?.moduleType,
          isAutomated: true,
          iconSrc: `${process.env.ASSETS_BASE_URL}/images/system/notification/link.png`,
          moduleId: data?.payload?.module?._id,
          value: `${data?.payload?.user?.name} unlinked compliance control(s).`,
          extraLogs: [
            {
              title: "Unlinked control(s)",
              description: `
  ${controls.compliance
    ?.map((control) => {
      return `${control.name} ${control?.control?.clause}: ${control?.control?.title}\n`;
    })
    .join("\n")}
  `,
              icon: `${process.env.ASSETS_BASE_URL}/images/system/notification/link-2.png`,
              image: `${process.env.ASSETS_BASE_URL}/images/system/notification/link-2.png`,
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
