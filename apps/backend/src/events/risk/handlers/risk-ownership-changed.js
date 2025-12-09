const { SERVER_EVENTS } = require("../../constants");
const ActivityService = require("../../../services/activity");
const moment = require("moment");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");
module.exports = {
  [SERVER_EVENTS.RISK_OWNERSHIP_CHANGED]: async function (data) {
    const activityService = new ActivityService(data.connection);
    try {
      logger.info("creating a risk activity", {_id: data?.risk?._id});
      await activityService.createActivity({
        moduleType: "risks",
        isAutomated: true,
        iconSrc: `${process.env.ASSETS_BASE_URL}/images/system/notification/ownership.png`,
        moduleId: data?.risk?._id,
        value: `${data?.user?.name} transferred the ownership to ${data?.risk?.owner?.name}.`,
        extraLogs: [
          {
            title: "Ownership history",
            description: `
Previously ${data.prevRisk.owner.name} was the owner of this risk.
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
