const { CipCRUDOperations } = require("./cip");
const { sendMail } = require("../../email/sendMail");
const { SERVER_EVENTS } = require("../../events/constants");
const eventEmitter = require("../../events/event-manager").getInstance();
const {
  moduleTypes,
} = require("../../models/mongodb/schemaTemplates/utils/moduleTypes");
const { APIError } = require("../../helpers/errors/apiError");
const { ReasonPhrases, StatusCodes } = require("http-status-codes");
const { mainChannel } = require("../../eventsV2/topic");
class ComplianceManager extends CipCRUDOperations {
  constructor(connection) {
    super(connection);
  }
  async linkISOControls(id, data) {
    let cip = await this.getCip({ _id: id });
    if (this._isImplemented(cip))
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Can not link toolkit to implemented OFI."
      );
    cip = await this.Cips.findOneAndUpdate(
      { _id: id },
      {
        $push: {
          "isoControls.toolkits": data.toolkits,
        },
        $push: {
          "isoControls.clauses": data.controls,
        },
      },
      { new: true }
    );
    mainChannel.topic(SERVER_EVENTS.CONTROL_HAS_BEEN_LINKED_TO_MODULE).emit({
      accessControl: this.connection,
      moduleType: moduleTypes.cips,
      module: cip,
      user: data.user,
      controls: data.controls,
    });
    // eventEmitter.emit(SERVER_EVENTS.CONTROL_HAS_BEEN_LINKED_TO_MODULE, {
    //   accessControl: this.connection,
    //   moduleType: moduleTypes.cips,
    //   module: cip,
    //   user: data.user,
    //   controls: data.controls,
    // });
    return this.Cips.populateCip(cip);
  }
  async removeISOControls(id, data) {
    let cip = await this.getCip({ _id: id });
    if (this._isImplemented(cip))
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Cannot unlink toolkit from implemented OFI."
      );
    cip = await this.Cips.findOneAndUpdate(
      { _id: id },
      {
        $pullAll: {
          "isoControls.toolkits": data.toolkits,
        },
        $pullAll: {
          "isoControls.clauses": data.controls,
        },
      },
      { new: true }
    );
    cip = await this.Cips.populateCip(cip);
    mainChannel
      .topic(SERVER_EVENTS.CONTROL_HAS_BEEN_UNLINKED_FROM_MODULE)
      .emit({
        accessControl: this.connection,
        moduleType: moduleTypes.cips,
        module: cip,
        user: data.user,
        controls: data.controls,
      });
    // eventEmitter.emit(SERVER_EVENTS.CONTROL_HAS_BEEN_UNLINKED_FROM_MODULE, {
    //   accessControl: this.connection,
    //   moduleType: moduleTypes.cips,
    //   module: cip,
    //   user: data.user,
    //   controls: data.controls,
    // });
    return cip;
  }
}
exports.ComplianceManager = ComplianceManager;
