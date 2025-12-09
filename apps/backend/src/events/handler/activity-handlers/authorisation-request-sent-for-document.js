const { SERVER_EVENTS } = require("../../constants");
const ActivityService = require("../../../services/activity");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");
module.exports = {
  [SERVER_EVENTS.DOCUMENT_AUTHORISATION_REQUESTD]: async function (data) {
    const activityService = new ActivityService(data.connection);
    try {
      const users = data.document?.documentData?.authorisation?.map(
        (auth) => auth?.user?.name
      );
      await activityService.createActivity({
        moduleType: "documenttrees",
        isAutomated: true,
        moduleId: data.document?._id,
        iconSrc: `${process.env.ASSETS_BASE_URL}/images/system/notification/sent.png`,
        value: `${
          data.createdBy?.name
        } requested authorisation from ${users.join(",")}.`,
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
