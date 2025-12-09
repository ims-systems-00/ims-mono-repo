const { SERVER_EVENTS } = require("../../constants");
const ActivityService = require("../../../services/activity");
const moment = require("moment");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");
module.exports = {
  [SERVER_EVENTS.INCIDENT_OWNERSHIP_CHANGED]: async function (data) {
    const activityService = new ActivityService(data.connection);
    try {
      logger.info("creating a incident activity", {_id: data?.incident?._id});
      await activityService.createActivity({
        moduleType: "incidents",
        isAutomated: true,
        iconSrc: `${process.env.ASSETS_BASE_URL}/images/system/notification/ownership.png`,
        moduleId: data?.incident?._id,
        value: `${data?.user?.name} changed the ownership for this incident to ${data?.incident?.owner?.name}.`,
        extraLogs: [
          {
            title: "Ownership history",
            description: `
Previously ${data.prevIncident.owner.name} was the owner of this incident.
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
