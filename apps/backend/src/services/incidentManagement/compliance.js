const { IncidentCRUDOperations } = require("./incidents");
const { sendMail } = require("../../email/sendMail");
const { SERVER_EVENTS } = require("../../events/constants");
const eventEmitter = require("../../events/event-manager").getInstance();
const {
  moduleTypes,
} = require("../../models/mongodb/schemaTemplates/utils/moduleTypes");
const { APIError } = require("../../helpers/errors/apiError");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");

class ComplianceManager extends IncidentCRUDOperations {
  constructor(connection) {
    super(connection);
  }
  async linkISOControls(id, data) {
    let incident = await this.getIncident({ _id: id });
    if (this._isResolved(incident))
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Can not link toolkit to resolved audit."
      );
    incident = await this.Incidents.findOneAndUpdate(
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
    incident = await this.Incidents.populateIncident(incident);
    mainChannel.topic(SERVER_EVENTS.CONTROL_HAS_BEEN_LINKED_TO_MODULE).emit({
      accessControl: this.connection,
      moduleType: moduleTypes.incidents,
      module: incident,
      user: data.user,
      controls: data.controls,
    });
    // eventEmitter.emit(SERVER_EVENTS.CONTROL_HAS_BEEN_LINKED_TO_MODULE, {
    //   accessControl: this.connection,
    //   moduleType: moduleTypes.incidents,
    //   module: incident,
    //   user: data.user,
    //   controls: data.controls,
    // });
    return incident;
  }
  async removeISOControls(id, data) {
    let incident = await this.getIncident({ _id: id });
    if (this._isResolved(incident))
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Cannot unlink toolkit from resolved incnident."
      );
    incident = await this.Incidents.findOneAndUpdate(
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
    incident = await this.Incidents.populateIncident(incident);
    mainChannel
      .topic(SERVER_EVENTS.CONTROL_HAS_BEEN_UNLINKED_FROM_MODULE)
      .emit({
        accessControl: this.connection,
        moduleType: moduleTypes.incidents,
        module: incident,
        user: data.user,
        controls: data.controls,
      });
    // eventEmitter.emit(SERVER_EVENTS.CONTROL_HAS_BEEN_UNLINKED_FROM_MODULE, {
    //   accessControl: this.connection,
    //   moduleType: moduleTypes.incidents,
    //   module: incident,
    //   user: data.user,
    //   controls: data.controls,
    // });
    return incident;
  }
}
exports.ComplianceManager = ComplianceManager;
