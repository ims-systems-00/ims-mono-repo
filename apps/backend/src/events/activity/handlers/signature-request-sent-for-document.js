const { SERVER_EVENTS } = require("../../constants");
const ActivityService = require("../../../services/activity");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");
module.exports = {
  [SERVER_EVENTS.DOCUMENT_SIGNATURE_REQUESTD]: async function (data) {
    logger.info("users and email retrived", {users: data.users, email: data.emails});
    const activityService = new ActivityService(data.connection);
    const externalUsersLog = data.emails?.length
      ? [
          {
            title: "List of external individuals who this document was sent to",
            description: `
${data.emails.map((email, i) => `${i + 1}. ${email}`).join("\n")}

`,
            icon: `${process.env.ASSETS_BASE_URL}/images/system/notification/sent.png`,
            image: `${process.env.ASSETS_BASE_URL}/images/system/notification/sent.png`,
          },
        ]
      : [];
    const internalUsersLog = data.users?.length
      ? [
          {
            title: "List of internal users who this document was sent to",
            description: `
${data.users
  .map((user, i) => `${i + 1}. ${user.name} (${user.email})`)
  .join("\n")}

`,
            icon: `${process.env.ASSETS_BASE_URL}/images/system/notification/sent.png`,
            image: `${process.env.ASSETS_BASE_URL}/images/system/notification/sent.png`,
          },
        ]
      : [];
    const messageLog = data.message
      ? [
          {
            title: `Message sent by ${data.createdBy?.name}`,
            description: `
${data.message}

`,
            icon: `${process.env.ASSETS_BASE_URL}/images/system/notification/sent.png`,
            image: `${process.env.ASSETS_BASE_URL}/images/system/notification/sent.png`,
          },
        ]
      : [];
    try {
      await activityService.createActivity({
        moduleType: "documenttrees",
        isAutomated: true,
        iconSrc: `${process.env.ASSETS_BASE_URL}/images/system/notification/sent.png`,
        moduleId: data.document?._id,
        value: `${data.createdBy?.name} sent this document to ${data.signatureType} individuals for signature.`,
        extraLogs: [...messageLog, ...internalUsersLog, ...externalUsersLog],
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
