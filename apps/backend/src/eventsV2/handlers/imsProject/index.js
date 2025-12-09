const { mainChannel } = require("../../topic");
const { SERVER_EVENTS_BUS } = require("../../topicsName");
const Notification = require("../../../services/notification");
const moment = require("moment");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");
const imsProjectMembership = require("../../../models/mongodb/system/imsProject/imsProjectMemberShip");
const user = require("../../../models/mongodb/system/users&auth/user");
const membership = require("../../../models/mongodb/system/membership/membership");
const { ROLES } = require("@ims-systems-00/ims-core/lib/constants");
const ActivityService = require("../../../services/activity");
const notificationIconUrl = `${process.env.ASSETS_BASE_URL}/images/logo/ims/project-ims.png`;
const membershipPopulation = [
  {
    path: "userId",
    select: "name email profileImageSrc",
  },
];

function register(app) {
  /**
   *
   *  Notifications
   */

  mainChannel
    .topic(SERVER_EVENTS_BUS.NEW_MEMBER_ADDED_INTO_PROJECT)
    .addListener(async (data) => {
      try {
        const notificationService = new Notification({
          connection: data.payload?.accessControl,
          socket: app.get("io"),
        });
        const User = user(data.payload?.accessControl);
        const ImsProjectMemberShip = imsProjectMembership(
          data.payload?.accessControl
        );
        const { name } = await User.findOne({
          _id: data?.payload?.imsProjectMembership?.userId,
        });
        let users = await ImsProjectMemberShip.find({
          imsProjectId: data?.payload?.imsProjectMembership?.imsProjectId,
        }).populate(membershipPopulation);
        const memberships = users.map((m) => m.userId);
        console.log("users", memberships);
        if (Array.isArray(memberships)) {
          await Promise.all(
            memberships.map(async (user) => {
              await notificationService.notifyV2(
                {
                  title: "Member Added ",
                  message: `${data?.payload?.imsProjectMembership?.createdBy?.name} added ${name} into ${data.payload?.imsProject?.title}.`,
                  group: null,
                  referenceType: "imsprojects",
                  referenceModule:
                    data?.payload?.imsProjectMembership?.imsProjectId,
                  user: user._id,
                  popUpStatus: "unread",
                  icon: notificationIconUrl,
                  params: {
                    id: data?.payload?.imsProject?._id,
                  },
                  screenIdentifier: `ims-project-detail`,
                  createdBy: data?.payload?.imsProjectMembership?.createdBy._id,
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
  mainChannel
    .topic(SERVER_EVENTS_BUS.NEW_MEMBER_ADDED_INTO_PROJECT)
    .addListener(async (data) => {
      try {
        const activityService = new ActivityService(
          data.payload?.accessControl
        );
        const User = user(data.payload?.accessControl);
        const { name } = await User.findOne({
          _id: data?.payload?.imsProjectMembership?.userId,
        });
        logger.info(
          `${data?.payload?.imsProjectMembership?.createdBy?.name} added ${name} into ${data.payload?.imsProject?.title}.`
        );
        await activityService.createActivity({
          moduleType: "imsprojects",
          isAutomated: true,
          iconSrc: `${process.env.ASSETS_BASE_URL}/images/logo/ims/project-ims.png`,
          moduleId: data?.payload?.imsProjectMembership?.imsProjectId,
          value: `${data?.payload?.imsProjectMembership?.createdBy?.name} added ${name} into ${data.payload?.imsProject?.title}.`,
          extraLogs: [],
          metaInfo: {},
          createdBy: data?.payload?.imsProjectMembership?.userId,
        });
      } catch (error) {
        logger.error(error.message, error);
      }
    });

  mainChannel
    .topic(SERVER_EVENTS_BUS.NEW_MILESTONE_CREATEED)
    .addListener(async (data) => {
      try {
        const activityService = new ActivityService(
          data.payload?.accessControl
        );
        logger.info(
          `${data?.payload?.accessControl?.user?.name} added the milestone ${data?.payload?.imsProjectWorkPackage?.title} in project ${data?.payload?.imsProject?.title}.`
        );
        await activityService.createActivity({
          moduleType: "imsprojects",
          isAutomated: true,
          iconSrc: `${process.env.ASSETS_BASE_URL}/images/logo/ims/project-ims.png`,
          moduleId: data?.payload?.imsProjectWorkPackage?.imsProjectId,
          value: `${data?.payload?.accessControl?.user?.name} added the milestone ${data?.payload?.imsProjectWorkPackage?.title} in project ${data?.payload?.imsProject?.title}.`,
          extraLogs: [],
          metaInfo: {},
          createdBy: data?.payload?.imsProjectWorkPackage?.createdBy,
        });
      } catch (error) {
        logger.error(error.message, error);
      }
    });

  mainChannel
    .topic(SERVER_EVENTS_BUS.MILESTONE_DELETED)
    .addListener(async (data) => {
      try {
        const activityService = new ActivityService(
          data.payload?.accessControl
        );
        logger.info(
          `${data?.payload?.accessControl?.user?.name} deleted milestone from the project.`
        );
        await activityService.createActivity({
          moduleType: "imsprojects",
          isAutomated: true,
          iconSrc: `${process.env.ASSETS_BASE_URL}/images/logo/ims/project-ims.png`,
          moduleId: data?.payload?.imsProjectWorkPackage?.imsProjectId,
          value: `${data?.payload?.accessControl?.user?.name} deleted milestone from the project.`,
          extraLogs: [],
          metaInfo: {},
          createdBy: data?.payload?.accessControl?.user?._id,
        });
      } catch (error) {
        logger.error(error.message, error);
      }
    });

  mainChannel
    .topic(SERVER_EVENTS_BUS.IMS_PROJECT_BUDGET_ADDED)
    .addListener(async (data) => {
      try {
        const activityService = new ActivityService(
          data.payload?.accessControl
        );
        logger.info(
          `${data?.payload?.imsProjectBudget?.createdBy?.name} added a new budget to the project.`
        );
        await activityService.createActivity({
          moduleType: "imsprojects",
          isAutomated: true,
          iconSrc: `${process.env.ASSETS_BASE_URL}/images/logo/ims/project-ims.png`,
          moduleId: data?.payload?.imsProjectBudget?.imsProjectId,
          value: `${data?.payload?.imsProjectBudget?.createdBy?.name} added a new budget to the project.`,
          extraLogs: [],
          metaInfo: {},
          createdBy: data?.payload?.imsProjectBudget?.createdBy,
        });
      } catch (error) {
        logger.error(error.message, error);
      }
    });

  mainChannel
    .topic(SERVER_EVENTS_BUS.IMS_PROJECT_BUDGET_UPDATED)
    .addListener(async (data) => {
      try {
        const activityService = new ActivityService(
          data.payload?.accessControl
        );
        logger.info(
          `${data?.payload?.accessControl?.user?.name} updated the budget info.`
        );
        await activityService.createActivity({
          moduleType: "imsprojects",
          isAutomated: true,
          iconSrc: `${process.env.ASSETS_BASE_URL}/images/logo/ims/project-ims.png`,
          moduleId: data?.payload?.imsProjectBudget?.imsProjectId,
          value: `${data?.payload?.accessControl?.user?.name} updated the budget info.`,
          extraLogs: [],
          metaInfo: {},
          createdBy: data?.payload?.accessControl?.user?._id,
        });
      } catch (error) {
        logger.error(error.message, error);
      }
    });

  mainChannel
    .topic(SERVER_EVENTS_BUS.IMS_PROJECT_BUDGET_DELETED)
    .addListener(async (data) => {
      try {
        const activityService = new ActivityService(
          data.payload?.accessControl
        );
        logger.info(
          `${data?.payload?.accessControl?.user?.name} deleted the budget.`
        );
        await activityService.createActivity({
          moduleType: "imsprojects",
          isAutomated: true,
          iconSrc: `${process.env.ASSETS_BASE_URL}/images/logo/ims/project-ims.png`,
          moduleId: data?.payload?.imsProjectBudget?.imsProjectId,
          value: `${data?.payload?.accessControl?.user?.name} deleted the budget .`,
          extraLogs: [],
          metaInfo: {},
          createdBy: data?.payload?.accessControl?.user?._id,
        });
      } catch (error) {
        logger.error(error.message, error);
      }
    });

  mainChannel
    .topic(SERVER_EVENTS_BUS.NEW_PROJECT_CREATED)
    .addListener(async (data) => {
      try {
        const activityService = new ActivityService(
          data.payload?.accessControl
        );
        logger.info(
          `${
            data?.payload?.accessControl?.user?.name
          } created a new project titled "${
            data?.payload?.imsProject?.title
          }" with a start date set for ${moment(
            data?.payload?.imsProject?.startDate
          ).format("MMMM Do, YYYY")}.`
        );
        await activityService.createActivity({
          moduleType: "imsprojects",
          isAutomated: true,
          iconSrc: `${process.env.ASSETS_BASE_URL}/images/logo/ims/project-ims.png`,
          moduleId: data?.payload?.imsProject?._id,
          value: `${
            data?.payload?.accessControl?.user?.name
          } created a new project titled "${
            data?.payload?.imsProject?.title
          }" with a start date set for ${moment(
            data?.payload?.imsProject?.startDate
          ).format("MMMM Do, YYYY")}.`,
          extraLogs: [],
          metaInfo: {},
          createdBy: data?.payload?.imsProject?.createdBy,
        });

        // Send notifications to all organization members
        const notificationService = new Notification({
          connection: data.payload?.accessControl,
          socket: app.get("io"),
        });

        const User = user(data.payload?.accessControl);
        const Membership = membership(data.payload?.accessControl);
        
        // Get all memberships in the organization
        const organizationMemberships = await Membership.find({
          organization: data.payload?.accessControl?.user?.organizationId,
          // "deleteMarker.status": false
        }).populate({
          path: "invitedUserId",
          select: "name email"
        });

        if (organizationMemberships && organizationMemberships.length > 0) {
          await Promise.all(
            organizationMemberships.map(async (membership) => {
          
              if (membership.invitedUserId._id.toString() === data.payload?.imsProject?.createdBy?.toString()) {
                return;
              }
              
              await notificationService.notifyV2(
                {
                  title: "New Project Created",
                  message: `${data.payload?.accessControl?.user?.name} created a new project titled "${data.payload?.imsProject?.title}" with a start date set for ${moment(data.payload?.imsProject?.startDate).format("MMMM Do, YYYY")}.`,
                  group: null,
                  referenceType: "imsprojects",
                  referenceModule: data.payload?.imsProject?._id,
                  user: membership.invitedUserId._id,
                  popUpStatus: "unread",
                  icon: notificationIconUrl,
                  params: {
                    id: data.payload?.imsProject?._id,
                  },
                  screenIdentifier: `ims-project-detail`,
                  createdBy: data.payload?.imsProject?.createdBy,
                },
                { email: false } 
              );
            })
          );
          
          logger.info(`Notifications sent to ${organizationMemberships.length - 1} organization members for new project: ${data.payload?.imsProject?.title}`);
        }
      } catch (error) {
        logger.error(error.message, error);
      }
    });
  mainChannel
    .topic(SERVER_EVENTS_BUS.NEW_TASK_CREATED)
    .addListener(async (data) => {
      try {
        const activityService = new ActivityService(
          data.payload?.accessControl
        );
        logger.info(
          `${data?.payload?.accessControl?.user?.name} added the task ${data?.payload?.imsProjectWorkPackage?.title} in project ${data?.payload?.imsProject?.title}.`
        );
        await activityService.createActivity({
          moduleType: "imsprojects",
          isAutomated: true,
          iconSrc: `${process.env.ASSETS_BASE_URL}/images/logo/ims/project-ims.png`,
          moduleId: data?.payload?.imsProjectWorkPackage?.imsProjectId,
          value: `${data?.payload?.accessControl?.user?.name} added the task ${data?.payload?.imsProjectWorkPackage?.title} in project ${data?.payload?.imsProject?.title}.`,
          extraLogs: [],
          metaInfo: {},
          createdBy: data?.payload?.imsProjectWorkPackage?.createdBy,
        });
      } catch (error) {
        logger.error(error.message, error);
      }
    });

  mainChannel
    .topic(SERVER_EVENTS_BUS.IMS_PROJECT_TASK_COMPLETE)
    .addListener(async (data) => {
      try {
        const activityService = new ActivityService(
          data.payload?.accessControl
        );
        logger.info(
          `${data?.payload?.accessControl?.user?.name} completed Task titled "${data?.payload?.imsProjectWorkPackage.title}".`
        );
        await activityService.createActivity({
          moduleType: "imsprojects",
          isAutomated: true,
          iconSrc: `${process.env.ASSETS_BASE_URL}/images/logo/ims/project-ims.png`,
          moduleId: data?.payload?.imsProjectWorkPackage?.imsProjectId,
          value: `${data?.payload?.accessControl?.user?.name} completed Task titled "${data?.payload?.imsProjectWorkPackage.title}".`,
          extraLogs: [],
          metaInfo: {},
          createdBy: data?.payload?.imsProjectWorkPackage?.createdBy,
        });
      } catch (error) {
        logger.error(error.message, error);
      }
    });

  mainChannel
    .topic(SERVER_EVENTS_BUS.MILESTONE_COMPLETE)
    .addListener(async (data) => {
      try {
        const activityService = new ActivityService(
          data.payload?.accessControl
        );
        logger.info(
          `${data?.payload?.accessControl?.user?.name} completed milestone titled "${data?.payload?.imsProjectWorkPackage.title}".`
        );
        await activityService.createActivity({
          moduleType: "imsprojects",
          isAutomated: true,
          iconSrc: `${process.env.ASSETS_BASE_URL}/images/logo/ims/project-ims.png`,
          moduleId: data?.payload?.imsProjectWorkPackage?.imsProjectId,
          value: `${data?.payload?.accessControl?.user?.name} completed milestone titled "${data?.payload?.imsProjectWorkPackage.title}."`,
          extraLogs: [],
          metaInfo: {},
          createdBy: data?.payload?.imsProjectWorkPackage?.createdBy,
        });
      } catch (error) {
        logger.error(error.message, error);
      }
    });
}

module.exports = { register };
