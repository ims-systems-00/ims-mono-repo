const { IncidentCRUDOperations } = require("./incidents");
const { sendMail } = require("../../email/sendMail");
const { SERVER_EVENTS } = require("../../events/constants");
const { APIError } = require("../../helpers/errors/apiError");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const eventEmitter = require("../../events/event-manager").getInstance();
const { mainChannel } = require("../../eventsV2/topic");
const { SERVER_EVENTS_BUS } = require("../../eventsV2/topicsName");

const membershipPopulation = [
  {
    path: "invitedUserId",
    select: "name email profileImageSrc",
  },
];

class Lifecycle extends IncidentCRUDOperations {
  constructor(connection) {
    super(connection);
  }
  async markIncidentAsResolved(id, data) {
    let incident = await this.getIncident({ _id: id });
    if (this._isResolved(incident))
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "This incident is already marked as resolved."
      );
    let { resolution, resolveStatus } = data;
    const createdTime = new Date(incident.created.on);
    const resolveTime = new Date();
    let resolutionTime = resolveTime.getTime() - createdTime.getTime();
    incident = await this.Incidents.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          resolution: resolution,
          "resolved.status": resolveStatus,
        },
      },
      { new: true }
    );
    if (resolveStatus)
      incident = await this.Incidents.findOneAndUpdate(
        { _id: id },
        {
          $set: {
            "resolved.by": this.connection.user._id,
            "resolved.on": Date.now(),
            resolutionTime: resolutionTime,
          },
        },
        { new: true }
      );
    incident = await this.Incidents.populateIncident(incident);
    mainChannel.topic(SERVER_EVENTS.INCIDENT_RESOLVED).emit({
      accessControl: this.connection,
      incident,
    });
    // eventEmitter.emit(SERVER_EVENTS.INCIDENT_RESOLVED, {
    //   accessControl: this.connection,
    //   incident,
    // });
    return incident;
  }
  async escalateIncident(id, data) {
    let incident = await this.getIncident({ _id: id });
    // let { escalatedBy } = data;
    if (this._isResolved(incident))
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Cannot escalate resolved incident."
      );
    if (this._isEscalated(incident))
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "This incident is already escalated."
      );
    incident = await this.Incidents.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          "escalated.status": true,
          "escalated.by": this.connection.user?._id,
          "escalated.on": Date.now(),
        },
      },
      { new: true }
    );
    incident = await this.Incidents.populateIncident(incident);
    // this.trigger.sendNotification("escalateIncidentEvent", incident, {
    //   email: true,
    // });

    mainChannel.topic(SERVER_EVENTS_BUS.ESCALATE_INCIDENT_EVENT).emit({
      accessControl: this.connection,
      incident,
    });
    mainChannel.topic(SERVER_EVENTS.INCIDENT_ESCALATED).emit({
      accessControl: this.connection,
      incident,
    });

    // eventEmitter.emit(SERVER_EVENTS.INCIDENT_ESCALATED, {
    //   accessControl: this.connection,
    //   incident,
    // });
    return incident;
  }
}
exports.Lifecycle = Lifecycle;
