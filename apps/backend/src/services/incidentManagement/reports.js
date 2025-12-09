const { IncidentCRUDOperations } = require("./incidents");
const { sendMail } = require("../../email/sendMail");
const { SERVER_EVENTS } = require("../../events/constants");
const { IMS_POLICIES } = require("@ims-systems-00/ims-core/lib/constants");
const eventEmitter = require("../../events/event-manager").getInstance();
const moment = require("moment");
class IncidentReports extends IncidentCRUDOperations {
  constructor(connection) {
    super(connection);
  }
  async extractReport(query) {
    let incidents = await this.Incidents.findByOrg(
      this.connection?.user?.organizationId,
      query
    )
      .limit(100)
      .sort("-createdAt");
    incidents = await Promise.all(
      incidents.map((incident) => this.Incidents.populateIncident(incident))
    );
    let fileds = [
      { label: "Reference", value: "ID" },
      { label: "Business unit", value: "group" },
      { label: "Title", value: "incident" },
      { label: "Description", value: "description" },
      { label: "Method of notification", value: "methodOfNotification" },
      { label: "Affected service", value: "affectedService" },
      { label: "Priority", value: "priority" },
      { label: "Incident owner", value: "resolvedBy" },
      { label: "Is organisational", value: "privacy" },
      { label: "Resolution", value: "resolution" },
      { label: "Raised date", value: "createdOn" },
      { label: "Raised by", value: "createdBy" },
      { label: "Resolved date", value: "resolvedOn" },
      { label: "Resolved by", value: "resolvedBy" },
      { label: "Escalated date", value: "escalatedOn" },
      { label: "Escalated by", value: "escalatedBy" },
    ];
    let data = incidents.map((incident) => ({
      ID: `INC-${incident.ID}`,
      group: incident.group ? incident.group.name : incident.affectedService,
      incident: incident.title,
      description: incident.description,
      methodOfNotification: incident.methodOfNotification,
      affectedService: incident.affectedService,
      priority: incident.priority,
      owner: incident.owner ? incident.owner.name : "",
      privacy: incident.privacy === "Organisational" ? "Yes" : "No",
      resolution: incident.resolution,
      createdOn: moment(incident.created.on).format("D/M/Y"),
      createdBy: incident.created.by ? incident.created.by.name : "",
      resolvedOn: incident.resolved.status
        ? moment(incident.resolved.on).format("D/M/Y")
        : "No date",
      resolvedBy: incident.resolved.by ? incident.resolved.by.name : "",
      escalatedOn: incident.escalated.status
        ? moment(incident.escalated.on).format("D/M/Y")
        : "No date",
      escaletedBy: incident.escalated.by ? incident.escalated.by.name : "",
    }));
    return this.fileHandler.csvGenerator(fileds, data);
  }
}
exports.IncidentReports = IncidentReports;
