const { SERVER_EVENTS } = require("../../constants");
const ActivityService = require("../../../services/activity");
const moment = require("moment");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");
module.exports = {
  [SERVER_EVENTS.OFI_IMPLEMENTED]: async function (data) {
    const activityService = new ActivityService(data.connection);
    try {
      logger.info("creating a cip activity", {_id: data?.cip?._id});
      await activityService.createActivity({
        moduleType: "cips",
        isAutomated: true,
        iconSrc: `${process.env.ASSETS_BASE_URL}/images/system/notification/resolved.png`,
        moduleId: data?.cip?._id,
        value: `${data?.cip?.implemented?.by?.name} implemented this OFI.`,
        extraLogs: [],
        metaInfo: {},
        createdBy: data?.cip?.implemented?.by?._id,
      });
    } catch (error) {
      logger.info(error);
    }
  },
};
