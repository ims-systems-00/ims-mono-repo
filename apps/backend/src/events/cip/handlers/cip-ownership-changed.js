const { SERVER_EVENTS } = require("../../constants");
const ActivityService = require("../../../services/activity");
const moment = require("moment");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");
module.exports = {
  [SERVER_EVENTS.OFI_OWNERSHIP_CHANGED]: async function (data) {
    const activityService = new ActivityService(data.connection);
    try {
      logger.info("creating a cip activity", {_id: data?.cip?._id});
      await activityService.createActivity({
        moduleType: "cips",
        isAutomated: true,
        iconSrc: `${process.env.ASSETS_BASE_URL}/images/system/notification/ownership.png`,
        moduleId: data?.cip?._id,
        value: `${data?.user?.name} changed the ownership for this OFI to ${data?.cip?.owner?.name}.`,
        extraLogs: [
          {
            title: "Ownership history",
            description: `
Previously ${data.prevCip.owner.name} was the owner of this OFI.
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
