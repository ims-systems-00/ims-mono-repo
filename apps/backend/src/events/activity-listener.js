const eventEmitter = require("./event-manager").getInstance();
const eventsHandlers = {
  ...require("./handler/activity-handlers/document-version-added"),
  ...require("./handler/activity-handlers/authorisation-request-sent-for-document"),
  ...require("./handler/activity-handlers/signature-request-sent-for-document"),
  ...require("./handler/activity-handlers/document-signed-by-the-person"),
  ...require("./handler/activity-handlers/document-revision-added"),
  ...require("./handler/activity-handlers/auth-document-reviewed-by-the-person"),
  ...require("./handler/activity-handlers/document-conformance"),
  ...require("./handler/activity-handlers/document-shared-via-email"),
};
const { logger } = require("@ims-systems-00/ims-core/lib/logger");
function registerActivityListeners() {
  Object.keys(eventsHandlers).forEach((eventName) => {
    eventEmitter.on(eventName, function (data) {
      if (!data?.accessControl)
        throw new Error("accessControl required to manage automated activity.");
      data.connection = data?.accessControl;
      eventsHandlers[eventName](data);
    });
  });
  logger.info("Automated activity listeners registered");
}
module.exports = { registerActivityListeners };
