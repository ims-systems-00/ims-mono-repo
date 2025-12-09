const { SERVER_EVENTS } = require("../../constants");
const ActivityService = require("../../../services/activity");
const moment = require("moment");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");
module.exports = {
  [SERVER_EVENTS.TASK_HAS_BEEN_LINKED_TO_MODULE]: async function (data) {
    const activityService = new ActivityService(data.connection);
    try {
      logger.info("creating a task activity", {_id: data?.task?._id});
      /** following activity is for logging in source module activities */
      await activityService.createActivity({
        moduleType: data?.task?.source?.moduleType,
        isAutomated: true,
        iconSrc: `${process.env.ASSETS_BASE_URL}/images/system/notification/link.png`,
        moduleId: data?.task?.source?.module?._id,
        value: `${data?.task?.created?.by?.name} created a task.`,
        extraLogs: [
          {
            title: "Task details",
            description: `
Reference: ${data?.task?.reference}
Title: ${data?.task?.name}
Assigned to: ${
              data?.task?.assignedTo.length
                ? data?.task?.assignedTo
                    ?.map((assigned) => {
                      return assigned?.user?.name;
                    })
                    .join(", ")
                : "N/A"
            }
Due date: ${moment(new Date(data?.task?.due)).format("DD/MM/YYYY")}
Owner: ${data?.task?.created?.by?.name}
`,
            icon: `${process.env.ASSETS_BASE_URL}/images/system/notification/sent.png`,
            image: `${process.env.ASSETS_BASE_URL}/images/system/notification/sent.png`,
          },
        ],
        metaInfo: {},
        createdBy: data?.task?.created?.by?._id,
      });
      /** following activity is for logging in this task activities */
      await activityService.createActivity({
        moduleType: "tasks",
        isAutomated: true,
        iconSrc: `${process.env.ASSETS_BASE_URL}/images/system/notification/link.png`,
        moduleId: data?.task?._id,
        value: `${data?.task?.created?.by?.name} linked this task to ${data?.task?.source?.module?.reference}.`,
        extraLogs: [],
        metaInfo: {},
        createdBy: data?.task?.created?.by?._id,
      });
    } catch (error) {
      logger.info(error);
    }
  },
};
