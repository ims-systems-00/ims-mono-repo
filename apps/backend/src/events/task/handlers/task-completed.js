const { SERVER_EVENTS } = require("../../constants");
const ActivityService = require("../../../services/activity");
const moment = require("moment");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");
module.exports = {
  [SERVER_EVENTS.TASK_COMPLETED]: async function (data) {
    const activityService = new ActivityService(data.connection);
    try {
      logger.info("creating a task activity", {_id: data?.task?._id});
      await activityService.createActivity({
        moduleType: data?.task?.source?.moduleType,
        isAutomated: true,
        iconSrc: `${process.env.ASSETS_BASE_URL}/images/system/notification/task-completed.png`,
        moduleId: data?.task?.source?.module?._id,
        value: `${data?.task?.completed?.by?.name} completed task ${data?.task?.reference}.`,
        extraLogs: [],
        metaInfo: {},
        createdBy: data?.task?.completed?.by?._id,
      });
      await activityService.createActivity({
        moduleType: "tasks",
        isAutomated: true,
        iconSrc: `${process.env.ASSETS_BASE_URL}/images/system/notification/task-completed.png`,
        moduleId: data?.task?._id,
        value: `${data?.task?.completed?.by?.name} completed this task.`,
        extraLogs: [],
        metaInfo: {},
        createdBy: data?.task?.completed?.by?._id,
      });
    } catch (error) {
      logger.info(error);
    }
  },
};
