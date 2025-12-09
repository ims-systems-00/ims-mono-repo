const { mainChannel } = require("../../topic");
const { SERVER_EVENTS_BUS } = require("../../topicsName");
const Notification = require("../../../services/notification");
const ActivityService = require("../../../services/activity");
const user = require("../../../models/mongodb/system/users&auth/user");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");
const { SERVER_EVENTS } = require("../../../events/constants");
const notificationIconUrl = `${process.env.ASSETS_BASE_URL}/images/system/notification`;
const moment = require("moment");

function register(app) {
  mainChannel
    .topic(SERVER_EVENTS_BUS.NEW_TASK_ASSIGNEE_EVENT)
    .addListener(async (data) => {
      try {
        const notificationService = new Notification({
          connection: data?.payload?.accessControl,
          socket: app.get("io"),
        });

        let users = data?.payload?.prevTask
          ? data?.payload?.task?.assignedTo
              .filter(
                (assignee) =>
                  !data?.payload?.prevTask?.assignedTo
                    .map(
                      (assignee) =>
                        assignee.user && assignee.user._id.toString()
                    )
                    .includes(assignee && assignee.user._id.toString())
              )
              .map((assignee) => assignee.user)
          : data?.payload?.task?.assignedTo.map((assignee) => assignee.user);

        if (Array.isArray(users)) {
          await Promise.all(
            users.map(async (user) => {
              await notificationService.notifyV2(
                {
                  title: "Task manager",
                  message: `${
                    data?.payload?.task?.pteamTask ? "Team task" : "Task"
                  } ${data?.payload?.task?.reference} ${
                    data?.payload?.task?.name
                  } has been assigned to you by ${
                    data?.payload?.task?.created.by.name
                  }.`,
                  group:
                    data?.payload?.task?.group &&
                    data?.payload?.task?.group?._id,
                  referenceType: "tasks",
                  referenceModule: data?.payload?.task?._id,
                  screenIdentifier: `task-manager-detail`,
                  params: {
                    group:
                      data?.payload?.task?.group &&
                      data?.payload?.task?.group?._id,
                    id: data?.payload?.task?._id,
                  },
                  user: user._id,
                  popUpStatus: "read",
                  icon: notificationIconUrl + "/task-assigned.png",
                  createdBy: data?.payload?.task?.created.by._id,
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
    .topic(SERVER_EVENTS_BUS.TASK_COMPLETED_EVENT)
    .addListener(async (data) => {
      try {
        const notificationService = new Notification({
          connection: data.payload?.accessControl,
          socket: app.get("io"),
        });
        let users = [data.payload?.task?.created.by];
        if (Array.isArray(users)) {
          await Promise.all(
            users.map(async (user) => {
              await notificationService.notifyV2(
                {
                  title: "Task manager",
                  message: `Task ${data.payload?.task?.reference} ${data.payload?.task?.name} has been completed by ${data.payload?.task?.completed.by.name}.`,
                  group:
                    data.payload?.task?.group && data.payload?.task?.group?._id,
                  referenceType: "tasks",
                  referenceModule: data.payload?.task?._id,
                  screenIdentifier: `task-manager-detail`,
                  params: {
                    group:
                      data.payload?.task?.group &&
                      data.payload?.task?.group?._id,
                    id: data.payload?.task?._id,
                  },
                  user: user._id,
                  popUpStatus: "read",
                  icon: notificationIconUrl + "/task-completed.png",
                  createdBy: data.payload?.task?.completed.by._id,
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
    .topic(SERVER_EVENTS_BUS.TASK_REQUEST_STATUS_CHANGE_EVENT)
    .addListener(async (data) => {
      try {
        const notificationService = new Notification({
          connection: data.payload?.accessControl,
          socket: app.get("io"),
        });

        let assignee = data.payload?.task?.assignedTo.find(
          (assignee) =>
            assignee.user &&
            assignee.user._id.toString() === data?.payload?.userId.toString()
        );
        if (!assignee) return;
        let users = [data.payload?.task?.created.by];

        if (!users.length) return;
        if (Array.isArray(users)) {
          await Promise.all(
            users.map(async (user) => {
              await notificationService.notifyV2(
                {
                  title: "Task manager",
                  message: `${data.payload?.task?.reference} ${
                    data.payload?.task?.name
                  } has been ${assignee.acceptance.toLowerCase()} by ${
                    assignee.user.name
                  }.`,
                  group:
                    data.payload?.task?.group && data.payload?.task?.group?._id,
                  referenceType: "tasks",
                  referenceModule: data.payload?.task?._id,
                  screenIdentifier: `task-manager-detail`,
                  params: {
                    group:
                      data.payload?.task?.group &&
                      data.payload?.task?.group?._id,
                    id: data.payload?.task?._id,
                  },
                  user: user._id,
                  popUpStatus: "read",
                  icon: notificationIconUrl + "/notification-default.png",
                  createdBy: assignee.user && assignee.user._id,
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
    .topic(SERVER_EVENTS_BUS.NUDGE_TO_LOOK_AT_TASK)
    .addListener(async (data) => {
      try {
        const notificationService = new Notification({
          connection: data.payload?.accessControl,
          socket: app.get("io"),
        });
        const User = user(data.payload?.accessControl);

        let assignedTo = data?.payload?.content?.assignedTo?.map(
          (assignee) => assignee.user
        );
        let users = await User.find({
          _id: { $in: assignedTo },
        }).select("name email");

        if (Array.isArray(users)) {
          await Promise.all(
            users.map(async (user) => {
              await notificationService.notifyV2(
                {
                  title: "Task management",
                  message: `${data.payload?.content?.nudged.by.name} nudged you to look at task ${data.payload?.content?.reference} ${data.payload?.content?.name}`,
                  group: null,
                  referenceType: "tasks",
                  referenceModule: data.payload?.content?._id,
                  user: user._id,
                  popUpStatus: "unread",
                  icon: notificationIconUrl + "/nudge-notification.png",
                  params: {
                    group: null,
                    id: data.payload?.content?._id,
                  },
                  screenIdentifier: `task-manager-detail`,
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
    .topic(SERVER_EVENTS.TASK_ACCEPTANCE_BY_USER)
    .addListener(async (data) => {
      try {
        const activityService = new ActivityService(
          data.payload?.accessControl
        );
        logger.info("creating a task activity", {
          _id: data?.payload?.task?._id,
        });
        await activityService.createActivity({
          moduleType: "tasks",
          isAutomated: true,
          iconSrc: `${process.env.ASSETS_BASE_URL}/images/system/notification/sent.png`,
          moduleId: data?.payload?.task?._id,
          value: `${data?.payload?.user?.name} ${data?.payload?.status} this task.`,
          extraLogs: [],
          metaInfo: {},
          createdBy: data?.payload?.task?.created?.by?._id,
        });
      } catch (error) {
        logger.error(error.message, error);
      }
    });
  mainChannel.topic(SERVER_EVENTS.TASK_CREATED).addListener(async (data) => {
    try {
      const activityService = new ActivityService(data.payload?.accessControl);
      logger.info("creating a task activity", {
        _id: data?.payload?.task?._id,
      });
      await activityService.createActivity({
        moduleType: "tasks",
        isAutomated: true,
        iconSrc: `${process.env.ASSETS_BASE_URL}/images/system/notification/create.png`,
        moduleId: data?.payload?.task?._id,
        value: `${data?.payload?.task?.created?.by?.name} created this task.`,
        extraLogs: [],
        metaInfo: {},
        createdBy: data?.payload?.task?.created?.by?._id,
      });
    } catch (error) {
      logger.error(error.message, error);
    }
  });
  mainChannel.topic(SERVER_EVENTS.TASK_COMPLETED).addListener(async (data) => {
    try {
      const activityService = new ActivityService(data.payload?.accessControl);
      logger.info("creating a task activity", {
        _id: data?.payload?.task?._id,
      });
      await activityService.createActivity({
        moduleType: data?.payload?.task?.source?.moduleType,
        isAutomated: true,
        iconSrc: `${process.env.ASSETS_BASE_URL}/images/system/notification/task-completed.png`,
        moduleId: data?.payload?.task?.source?.module?._id,
        value: `${data?.payload?.task?.completed?.by?.name} completed task ${data?.payload?.task?.reference}.`,
        extraLogs: [],
        metaInfo: {},
        createdBy: data?.payload?.task?.completed?.by?._id,
      });
      await activityService.createActivity({
        moduleType: "tasks",
        isAutomated: true,
        iconSrc: `${process.env.ASSETS_BASE_URL}/images/system/notification/task-completed.png`,
        moduleId: data?.payload?.task?._id,
        value: `${data?.payload?.task?.completed?.by?.name} completed this task.`,
        extraLogs: [],
        metaInfo: {},
        createdBy: data?.payload?.task?.completed?.by?._id,
      });
    } catch (error) {
      logger.error(error.message, error);
    }
  });
  mainChannel
    .topic(SERVER_EVENTS.TASK_IN_PROGRESS)
    .addListener(async (data) => {
      try {
        const activityService = new ActivityService(
          data.payload?.accessControl
        );
        logger.info("creating a task activity", {
          _id: data?.payload?.task?._id,
        });
        await activityService.createActivity({
          moduleType: "tasks",
          isAutomated: true,
          iconSrc: `${process.env.ASSETS_BASE_URL}/images/system/notification/escalated.png`,
          moduleId: data?.payload?.task?._id,
          value: `This task is now in progress.`,
          extraLogs: [],
          metaInfo: {},
          createdBy: data?.payload?.task?.created?.by?._id,
        });
      } catch (error) {
        logger.error(error.message, error);
      }
    });
  mainChannel
    .topic(SERVER_EVENTS.TASK_HAS_BEEN_LINKED_TO_MODULE)
    .addListener(async (data) => {
      try {
        const activityService = new ActivityService(
          data.payload?.accessControl
        );
        logger.info("creating a task activity", {
          _id: data?.payload?.task?._id,
        });
        await activityService.createActivity({
          moduleType: data?.payload?.task?.source?.moduleType,
          isAutomated: true,
          iconSrc: `${process.env.ASSETS_BASE_URL}/images/system/notification/link.png`,
          moduleId: data?.payload?.task?.source?.module?._id,
          value: `${data?.payload?.task?.created?.by?.name} created a task.`,
          extraLogs: [
            {
              title: "Task details",
              description: `
  Reference: ${data?.payload?.task?.reference}
  Title: ${data?.payload?.task?.name}
  Assigned to: ${
    data?.payload?.task?.assignedTo.length
      ? data?.payload?.task?.assignedTo
          ?.map((assigned) => {
            return assigned?.user?.name;
          })
          .join(", ")
      : "N/A"
  }
  Due date: ${moment(new Date(data?.payload?.task?.due)).format("DD/MM/YYYY")}
  Owner: ${data?.payload?.task?.created?.by?.name}
  `,
              icon: `${process.env.ASSETS_BASE_URL}/images/system/notification/sent.png`,
              image: `${process.env.ASSETS_BASE_URL}/images/system/notification/sent.png`,
            },
          ],
          metaInfo: {},
          createdBy: data?.payload?.task?.created?.by?._id,
        });

        /** following activity is for logging in this task activities */
        await activityService.createActivity({
          moduleType: "tasks",
          isAutomated: true,
          iconSrc: `${process.env.ASSETS_BASE_URL}/images/system/notification/link.png`,
          moduleId: data?.payload?.task?._id,
          value: `${data?.payload?.task?.created?.by?.name} linked this task to ${data?.payload?.task?.source?.module?.reference}.`,
          extraLogs: [],
          metaInfo: {},
          createdBy: data?.payload?.task?.created?.by?._id,
        });
      } catch (error) {
        logger.error(error.message, error);
      }
    });
}

module.exports = { register };
