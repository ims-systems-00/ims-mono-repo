const { SERVER_EVENTS } = require("../../constants");
const ActivityService = require("../../../services/activity");
const moment = require("moment");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");
module.exports = {
  [SERVER_EVENTS.INCIDENT_CREATED]: async function (data) {
    const activityService = new ActivityService(data.connection);
    try {
      logger.info("creating a incident activity", {_id: data?.incident?._id});
      await activityService.createActivity({
        moduleType: "incidents",
        isAutomated: true,
        iconSrc: `${process.env.ASSETS_BASE_URL}/images/system/notification/create.png`,
        moduleId: data?.incident?._id,
        value: `${data?.incident?.created?.by?.name} raised this incident.`,
        extraLogs: [],
        metaInfo: {},
        createdBy: data?.incident?.created?.by?._id,
      });
    } catch (error) {
      logger.info(error);
    }
  },
};
