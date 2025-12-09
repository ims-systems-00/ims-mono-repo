const { SERVER_EVENTS } = require("../../constants");
const ActivityService = require("../../../services/activity");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");
module.exports = {
  [SERVER_EVENTS.DOCUMENT_SHARED_VIA_EMAIL]: async function (data) {
    const activityService = new ActivityService(data.connection);
    try {
      await activityService.createActivity({
        moduleType: "documenttrees",
        isAutomated: true,
        iconSrc: `${process.env.ASSETS_BASE_URL}/images/system/notification/document-uploaded.png`,
        moduleId: data.document?._id,
        value: `${
          data.sender?.name
        } shared this document with ${data.emails.join(", ")}.`,
        extraLogs: [
          {
            title: "Message",
            description: `

${data.message}

`,
            icon: `${process.env.ASSETS_BASE_URL}/images/system/notification/sent.png`,
            image: `${process.env.ASSETS_BASE_URL}/images/system/notification/sent.png`,
          },
        ],
        metaInfo: {
          threadId:data.document?.documentData?.threadId
        },
        createdBy: data.sender?._id,
      });
    } catch (error) {
      logger.info(error);
    }
  },
};
