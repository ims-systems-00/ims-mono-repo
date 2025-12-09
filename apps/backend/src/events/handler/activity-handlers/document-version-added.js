const { SERVER_EVENTS } = require("../../constants");
const ActivityService = require("../../../services/activity");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");
module.exports = {
  [SERVER_EVENTS.ADDED_NEW_VERSION_OF_DOCUMENT]: async function (data) {
    const activityService = new ActivityService(data.connection);
    try {
      await activityService.createActivity({
        moduleType: "documenttrees",
        isAutomated: true,
        iconSrc: `${process.env.ASSETS_BASE_URL}/images/system/notification/document-uploaded.png`,
        moduleId: data.document?._id,
        value: `${data.createdBy?.name} has published version ${data.document?.documentData?.dvID}.`,
        metaInfo: {
          threadId: data.document?.documentData?.threadId,
        },
        createdBy: data.createdBy?._id,
      });
    } catch (error) {
      logger.info(error);
    }
  },
};
