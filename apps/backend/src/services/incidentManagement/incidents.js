const { Manager } = require("./manager");
const { sendMail } = require("../../email/sendMail");
const { SERVER_EVENTS } = require("../../events/constants");
const eventEmitter = require("../../events/event-manager").getInstance();
const {
  moduleTypes,
} = require("../../models/mongodb/schemaTemplates/utils/moduleTypes");
const { APIError } = require("../../helpers/errors/apiError");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const { basicRoleScopedFilter } = require("../../queries");
const { mainChannel } = require("../../eventsV2/topic");
const { SERVER_EVENTS_BUS } = require("../../eventsV2/topicsName");
const {
  IMS_POLICIES,
  ROLES,
} = require("@ims-systems-00/ims-core/lib/constants");
const membershipPopulation = [
  {
    path: "invitedUserId",
    select: "name email profileImageSrc",
  },
];

class IncidentCRUDOperations extends Manager {
  constructor(connection) {
    super(connection);
  }
  async createIncident(data) {
    let incident = new this.Incidents({
      organization: this.connection.user.organizationId,
      tagsAndCategories: data.tagsAndCategories,
      group: data.group,
      title: data.title,
      description: data.description,
      methodOfNotification: data.methodOfNotification,
      privacy: data.privacy,
      priority: data.priority,
      owner: data.owner,
      affectedService: data.affectedService,
      attachments: data.attachments ? data.attachments : [],
      source: {
        moduleType: data.moduleType,
        module: data.moduleId ? data.moduleId : null,
      },
      created: {
        by: data.createdBy._id,
        on: Date.now(),
      },
    });
    await incident.save();
    incident = await this.Incidents.populateIncident(incident);
    // this.trigger.sendNotification("newIncidentOwnerEvent", incident, {
    //   email: true,
    // });
    let users = [data.owner];
    mainChannel.topic(SERVER_EVENTS_BUS.NEW_INCIDENT_OWNER_EVENT).emit({
      accessControl: this.connection,
      incident,
      users,
    });
    this.Incidents.createCalenderEvent(incident);
    // eventEmitter.emit(SERVER_EVENTS.CHECKOUT_POTENTIAL_COMPLAINCE, {
    //   accessControl: this.connection,
    //   moduleType: moduleTypes.incidents,
    //   user: data.createdBy,
    // });
    mainChannel.topic(SERVER_EVENTS.CHECKOUT_POTENTIAL_COMPLAINCE).emit({
      accessControl: this.connection,
      moduleType: moduleTypes.incidents,
      user: data.createdBy,
    });
    mainChannel.topic(SERVER_EVENTS.INCIDENT_CREATED).emit({
      accessControl: this.connection,
      incident,
    });
    // eventEmitter.emit(SERVER_EVENTS.INCIDENT_CREATED, {
    //   accessControl: this.connection,
    //   incident,
    // });
    return incident;
  }

  async updateIncident(id, data) {
    try {
      let prevIncident = await this.getIncident({ _id: id });
      if (!prevIncident) {
        throw new Error("Incident not found");
      }
      if (this._isResolved(prevIncident)) {
        throw new APIError(
          ReasonPhrases.BAD_REQUEST,
          StatusCodes.BAD_REQUEST,
          "Cannot update resolved incident."
        );
      }

      const mutations = { ...data };
      delete mutations["attachments"];
      delete mutations["resolveStatus"];

      let incident = await this.Incidents.findOneAndUpdate(
        { _id: id },
        {
          $set: {
            ...mutations,
            updated: {
              by: data.updatedBy._id,
              on: Date.now(),
            },
          },
          $push: { attachments: data.attachments ? data.attachments : [] },
        },
        { new: true }
      );

      if (!incident) {
        throw new Error("Incident update failed");
      }

      if (data.resolveStatus) {
        const createdTime = new Date(incident.created.on);
        const resolveTime = new Date();
        let resolutionTime = resolveTime.getTime() - createdTime.getTime();
        incident = await this.Incidents.findOneAndUpdate(
          { _id: id },
          {
            $set: {
              "resolved.status": true,
              "resolved.by": data.updatedBy._id,
              "resolved.on": Date.now(),
              resolutionTime: resolutionTime,
            },
          },
          { new: true }
        );
      }

      incident = await this.Incidents.populateIncident(incident);

      if (data.resolveStatus) {
        console.log("resolve status", data.resolveStatus);
        mainChannel.topic(SERVER_EVENTS_BUS.RESOLVE_INCIDENT_EVENT).emit({
          accessControl: this.connection,
          incident,
        });
        mainChannel.topic(SERVER_EVENTS.INCIDENT_RESOLVED).emit({
          accessControl: this.connection,
          incident,
        });
      }

      if (
        prevIncident.owner?._id?.toString() !== incident.owner?._id?.toString()
      ) {
        mainChannel.topic(SERVER_EVENTS.INCIDENT_OWNERSHIP_CHANGED).emit({
          accessControl: this.connection,
          user: data.updatedBy,
          prevIncident,
          incident,
        });
      }

      if (data.attachments?.length) {
        mainChannel.topic(SERVER_EVENTS.ATTACHMENT_ADDED).emit({
          accessControl: this.connection,
          moduleType: moduleTypes.incidents,
          module: incident,
          user: data.updatedBy,
          attachments: data.attachments,
        });
      }

      this.Incidents.updateCalenderEvent(incident);
      return incident;
    } catch (error) {
      console.error("Error updating incident:", error);
      throw error;
    }
  }

  async listIncidents(query, options) {
    let pagination = await this.Incidents.paginate(query, options);
    let incidents = pagination.docs;
    incidents = await Promise.all(
      incidents.map((incident) => this.Incidents.populateIncident(incident))
    );
    return { incidents, pagination: this.imsPaginationFormated(pagination) };
  }
  async listIncidentsByOrg(query, options) {
    let pagination = await this.Incidents.paginateByOrg(
      this.connection?.user?.organizationId,
      { ...query, ...basicRoleScopedFilter(this.connection) },
      options
    );
    let incidents = pagination.docs;
    incidents = await Promise.all(
      incidents.map((incident) => this.Incidents.populateIncident(incident))
    );
    return { incidents, pagination: this.imsPaginationFormated(pagination) };
  }
  async getIncident(query) {
    let incident = await this.Incidents.findOneByOrg(
      this.connection?.user?.organizationId,
      query
    );
    if (!incident)
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "No incident was found with the query."
      );
    return this.Incidents.populateIncident(incident);
  }
  async deleteIncident(id) {
    let incident = await this.getIncident({ _id: id });
    await this.Incidents.deleteOne({ _id: id });
    return incident;
  }
  async deleteAttachment(id, data) {
    let incident = await this.getIncident({ _id: id });
    incident = await this.Incidents.findOneAndUpdate(
      { _id: id },
      {
        $pull: { attachments: { _id: data.attachment_id } },
      },
      { new: true }
    );
    return this.Incidents.populateIncident(incident);
  }
}
exports.IncidentCRUDOperations = IncidentCRUDOperations;
