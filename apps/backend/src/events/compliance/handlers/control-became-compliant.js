const { SERVER_EVENTS } = require("../../constants");
const complianceAutomationQueue = require("../../../schedules/queues/complianceAutomation.queue");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");
module.exports = {
  [SERVER_EVENTS.CHECKOUT_POTENTIAL_COMPLAINCE]: async function (data) {
    try {
      complianceAutomationQueue.produce({
        accessControl: data.connection,
        moduleType: data.moduleType,
        user: data.user,
      });
    } catch (error) {
      logger.info(error);
    }
  },
};
