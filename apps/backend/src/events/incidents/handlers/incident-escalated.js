const { SERVER_EVENTS } = require("../../constants");
const ActivityService = require("../../../services/activity");
const moment = require("moment");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");
module.exports = {
  [SERVER_EVENTS.INCIDENT_ESCALATED]: async function (data) {
    const activityService = new ActivityService(data.connection);
    try {
      logger.info("creating a incident activity", {_id: data?.incident?._id});
      await activityService.createActivity({
        moduleType: "incidents",
        isAutomated: true,
        iconSrc: `${process.env.ASSETS_BASE_URL}/images/system/notification/escalated.png`,
        moduleId: data?.incident?._id,
        value: `${data?.incident?.escalated?.by?.name} escalated this incident.`,
        extraLogs: [],
        metaInfo: {},
        createdBy: data?.incident?.escalated?.by?._id,
      });
    } catch (error) {
      logger.info(error);
    }
  },
};
