const { SERVER_EVENTS } = require("../../constants");
const ActivityService = require("../../../services/activity");
const moment = require("moment");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");
module.exports = {
  [SERVER_EVENTS.OFI_IN_PROGRESS]: async function (data) {
    const activityService = new ActivityService(data.connection);
    try {
      logger.info("creating a cip activity", {_id: data?.cip?._id});
      await activityService.createActivity({
        moduleType: "cips",
        isAutomated: true,
        iconSrc: `${process.env.ASSETS_BASE_URL}/images/system/notification/escalated.png`,
        moduleId: data?.cip?._id,
        value: `This OFI is now in progress.`,
        extraLogs: [],
        metaInfo: {},
        createdBy: data?.cip?.created?.by?._id,
      });
    } catch (error) {
      logger.info(error);
    }
  },
};
