const {
  moduleTypes,
} = require("../../models/mongodb/schemaTemplates/utils/moduleTypes");
const { SERVER_EVENTS } = require("../../events/constants");
const eventEmitter = require("../../events/event-manager").getInstance();
const FileHandlerService = require("../fileHandler");
const { models } = require("../../models");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");
const { mainChannel } = require("../../eventsV2/topic");
class AutomationChecks {
  constructor(connection) {
    this.connection = connection;
    this.compiledModels = this._compileModels(connection);
    this.fileHandler = new FileHandlerService(connection);
  }
  _compileModels(connection) {
    let compiledModels = {};
    Object.keys(models).forEach((modelName) => {
      if (typeof models[modelName] === "function")
        compiledModels[modelName] = models[modelName](connection);
    });
    return compiledModels;
  }
  async checkoutModuleEvidencedCompliance() {
    let applicableModules = [
      moduleTypes.risks,
      moduleTypes.cips,
      moduleTypes.managementreviews,
      moduleTypes.audits,
      moduleTypes.incidents,
      moduleTypes.documenttrees,
    ];
    for (let moduleName of applicableModules) {
      let data = await this.compiledModels[moduleName].findOneByOrg(
        this.connection.user.organizationId,
        {}
      ); // put all mapping query or logic or functions for diferenct modules in future
      if (data) {
        logger.info("Strting checks...", { moduleType: moduleName });
        // eventEmitter.emit(SERVER_EVENTS.CHECKOUT_POTENTIAL_COMPLAINCE, {
        //   accessControl: this.connection,
        //   moduleType: moduleName,
        //   user: null,
        // });
        mainChannel.topic(SERVER_EVENTS.CHECKOUT_POTENTIAL_COMPLAINCE).emit({
          accessControl: this.connection,
          moduleType: moduleName,
          user: data.createdBy,
        });
      }
    }
  }
}
exports.AutomationChecks = AutomationChecks;
