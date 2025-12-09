const { SERVER_EVENTS } = require("../../constants");
const ActivityService = require("../../../services/activity");
const moment = require("moment");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");
module.exports = {
  [SERVER_EVENTS.ATTACHMENT_ADDED]: async function (data) {
    const activityService = new ActivityService(data.connection);
    try {
      await activityService.createActivity({
        moduleType: data.moduleType,
        isAutomated: true,
        iconSrc: `${process.env.ASSETS_BASE_URL}/images/system/notification/document-uploaded.png`,
        moduleId: data?.module?._id,
        value: `${data?.user?.name} added attachement(s).`,
        extraLogs: [
          {
            title: "Attachment details",
            description: `
${data.attachments
  ?.map((attachment) => {
    return attachment.Name;
  })
  .join("\n")}
`,
            icon: `${process.env.ASSETS_BASE_URL}/images/system/notification/sent.png`,
            image: `${process.env.ASSETS_BASE_URL}/images/system/notification/sent.png`,
          },
        ],
        metaInfo: {},
        createdBy: data?.user?._id,
      });
    } catch (error) {
      logger.info(error);
    }
  },
};
