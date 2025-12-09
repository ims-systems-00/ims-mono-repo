const { SERVER_EVENTS } = require("../../constants");
const ActivityService = require("../../../services/activity");
const moment = require("moment");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");
module.exports = {
  [SERVER_EVENTS.DOCUMENT_SIGNED]: async function (data) {
    const activityService = new ActivityService(data.connection);
    try {
      await activityService.createActivity({
        moduleType: "documenttrees",
        isAutomated: true,
        iconSrc: `${process.env.ASSETS_BASE_URL}/images/system/notification/document-signed.png`,
        moduleId: data.document?._id,
        value: `${data?.signee} signed this document.`,
        metaInfo: {
          threadId: data.document?.documentData?.threadId,
        },
        createdBy: null,
      });
    } catch (error) {
      logger.info(error);
    }
  },
};
