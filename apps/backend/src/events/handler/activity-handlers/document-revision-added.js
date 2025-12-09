const { SERVER_EVENTS } = require("../../constants");
const ActivityService = require("../../../services/activity");
const moment = require("moment");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");
module.exports = {
  [SERVER_EVENTS.ADDED_REVISED_DOCUMENT]: async function (data) {
    const activityService = new ActivityService(data.connection);
    try {
      await activityService.createActivity({
        moduleType: "documenttrees",
        isAutomated: true,
        iconSrc: `${process.env.ASSETS_BASE_URL}/images/system/notification/document-uploaded.png`,
        moduleId: data.document?._id,
        metaInfo: {
          threadId: data.document?.documentData?.threadId,
        },
        value: `${data.document?.created?.by?.name} added a revised version.`,
        createdBy: data.document?.created?.by?._id,
      });
    } catch (error) {
      logger.info(error);
    }
  },
};
