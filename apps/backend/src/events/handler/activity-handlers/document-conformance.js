const { SERVER_EVENTS } = require("../../constants");
const ActivityService = require("../../../services/activity");
const moment = require("moment");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");
module.exports = {
  [SERVER_EVENTS.DOCUMENT_CONFORMANCE_MILESTONE]: async function (data) {
    const activityService = new ActivityService(data.connection);
    try {
      await activityService.createActivity({
        moduleType: "documenttrees",
        isAutomated: true,
        iconSrc: `${process.env.ASSETS_BASE_URL}/images/system/notification/goal.png`,
        moduleId: data.document?._id,
        metaInfo: {
          threadId: data.document?.documentData?.threadId,
        },
        value: `This document has reached 100% conformance.`,
        createdBy: data.document?.created?.by?._id,
      });
    } catch (error) {
      logger.info(error);
    }
  },
};
