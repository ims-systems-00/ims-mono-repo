const { SERVER_EVENTS } = require("../../constants");
const ActivityService = require("../../../services/activity");
const moment = require("moment");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");
module.exports = {
  [SERVER_EVENTS.TASK_CREATED]: async function (data) {
    const activityService = new ActivityService(data.connection);
    try {
      logger.info("creating a task activity", {_id:data?.task?._id});
      await activityService.createActivity({
        moduleType: "tasks",
        isAutomated: true,
        iconSrc: `${process.env.ASSETS_BASE_URL}/images/system/notification/create.png`,
        moduleId: data?.task?._id,
        value: `${data?.task?.created?.by?.name} created this task.`,
        extraLogs: [],
        metaInfo: {},
        createdBy: data?.task?.created?.by?._id,
      });
    } catch (error) {
      logger.info(error);
    }
  },
};
