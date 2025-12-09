const { CipCRUDOperations } = require("./cip");
const { sendMail } = require("../../email/sendMail");
const { SERVER_EVENTS } = require("../../events/constants");
const { APIError } = require("../../helpers/errors/apiError");
const { ReasonPhrases, StatusCodes } = require("http-status-codes");
const eventEmitter = require("../../events/event-manager").getInstance();
const { mainChannel } = require("../../eventsV2/topic");
const { SERVER_EVENTS_BUS } = require("../../eventsV2/topicsName");

class Lifecycle extends CipCRUDOperations {
  constructor(connection) {
    super(connection);
  }
  async markCipAsImplemented(id, data) {
    let { implementedBy } = data;
    let cip = await this.getCip({ _id: id });
    if (this._isImplemented(cip))
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "This OFI is implemented."
      );
    cip = await this.Cips.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          implemented: {
            status: "Implemented",
            by: implementedBy?._id,
            on: Date.now(),
          },
        },
      },
      { new: true }
    );
    cip = await this.Cips.populateCip(cip);
    mainChannel.topic(SERVER_EVENTS_BUS.OFI_IMPLEMENTED_EVENT).emit({
      accessControl: this.connection,
      cip,
    });
    // this.trigger.sendNotification("ofiImplementdEvent", cip);
    // eventEmitter.emit(SERVER_EVENTS.OFI_IMPLEMENTED, {
    //   accessControl: this.connection,
    //   cip,
    // });
    return cip;
  }
}
exports.Lifecycle = Lifecycle;
