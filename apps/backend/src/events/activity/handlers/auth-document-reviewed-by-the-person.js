const { SERVER_EVENTS } = require("../../constants");
const ActivityService = require("../../../services/activity");
const moment = require("moment");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");
module.exports = {
  [SERVER_EVENTS.DOCUMENT_AUTH_REVIEWED]: async function (data) {
    const activityService = new ActivityService(data.connection);
    try {
      await activityService.createActivity({
        moduleType: "documenttrees",
        isAutomated: true,
        iconSrc: `${process.env.ASSETS_BASE_URL}/images/system/notification/document-authorised.png`,
        moduleId: data.document?._id,
        value: `${
          data?.authorisation?.user?.name
        } ${data?.authorisation?.status?.toLowerCase()} authorisation request.`,
        extraLogs: [
          {
            title: "Authorisation notes",
            description: `
${data.message}
`,
            icon: `${process.env.ASSETS_BASE_URL}/images/system/notification/sent.png`,
            image: `${process.env.ASSETS_BASE_URL}/images/system/notification/sent.png`,
          },
        ],
        metaInfo: {
          threadId: data.document?.documentData?.threadId,
        },
        createdBy: data?.authorisation?.user?._id,
      });
    } catch (error) {
      logger.info(error);
    }
  },
};
