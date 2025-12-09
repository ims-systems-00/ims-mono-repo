const automatedActivityManager = require("./activity");
const complianceEvents = require("./compliance");
const riskManagementEvents = require("./risk");
const incidentManagementEvents = require("./incidents");
const taskManagementEvents = require("./task");
const aiAnalysisResponseEvents = require("./aiResponse");
const cipEvents = require("./cip");
const eventManager = require("./event-manager");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");
function register() {
  logger.info("Registering event listeners");
  /** we are merging all the event objects here. */
  eventManager.register({
    ...complianceEvents,
    ...automatedActivityManager,
    ...riskManagementEvents,
    ...incidentManagementEvents,
    ...taskManagementEvents,
    ...aiAnalysisResponseEvents,
    ...cipEvents,
  });
}
module.exports = { register };
