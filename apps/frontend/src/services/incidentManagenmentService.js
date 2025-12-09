import { getCurrentSessionData } from "./authService";
import http from "./httpServices";
const apiEndPoint = `/api/${process.env.REACT_APP_API_VERSION}/incidents`;

export function getIncidents({ query }) {
  return http.get(`${apiEndPoint}/?${query}`);
}
export function getIncidentsReport({ query }) {
  return http.get(`${apiEndPoint}/reports/downloads/?${query}`, {
    responseType: "arraybuffer",
  });
}
export function getIncident(incidentId) {
  return http.get(`${apiEndPoint}/${incidentId}`);
}
export function createIncident(incident, options) {
  return http.post(
    `${apiEndPoint}/`,
    {
      ...incident,
    },
    {
      headers: {
        "x-moduleType": Array.isArray(options.moduleType)
          ? options.moduleType[0]
          : options.moduleType,
        "x-moduleId":
          options.moduleId &&
          options.moduleId !== "null" &&
          options.moduleId !== "undefined"
            ? options.moduleId
            : "",
      },
    }
  );
}
export function updateIncident(incidentId, incident, options) {
  return http.put(
    `${apiEndPoint}/${incidentId}`,
    {
      ...incident,
    },
    {
      headers: {
        "x-moduleType": options.moduleType,
        "x-moduleId":
          options.moduleId &&
          options.moduleId !== "null" &&
          options.moduleId !== "undefined"
            ? options.moduleId
            : "",
      },
    }
  );
}
export function deleteIncident(incidentId) {
  return http.delete(`${apiEndPoint}/${incidentId}/`);
}
export function resolveIncident(incidentId, data) {
  return http.put(`${apiEndPoint}/${incidentId}/resolution`, {
    resolvedBy: getCurrentSessionData().user._id,
    resolution: data.resolution,
    resolveStatus: data.resolveStatus,
  });
}
export function escalateIncident(incidentId) {
  return http.put(`${apiEndPoint}/${incidentId}/escalation`, {
    escalatedBy: getCurrentSessionData().user._id,
  });
}
export function removeAttachment(id, attachment_id) {
  return http.delete(`${apiEndPoint}/${id}/attachments/${attachment_id}`);
}
export function mapToIncidentModel(incident) {
  return {
    data: {
      group: {
        value: incident.group?._id,
        label: incident.group?.name,
      },
      owner: incident.owner
        ? {
            value: incident.owner._id,
            label: incident.owner.name,
          }
        : {
            value: null,
            label: "Select owner",
          },
      title: incident.title,
      description: incident.description,
      methodOfNotification: incident.methodOfNotification,
      privacy: incident.privacy === "Organisational",
      priority: {
        value: incident.priority,
        label: incident.priority,
      },
      tagsAndCategories: {
        value: incident.tagsAndCategories?._id,
        label: incident.tagsAndCategories?.name,
      },
      affectedService: incident.affectedService,
      resolution: incident.resolution,
      resolveStatus: incident.resolved.status,
      attachments: [],
      supplierIncident: incident?.source?.moduleType === "suppliers",
      supplier:
        incident?.source?.moduleType === "suppliers"
          ? {
              value: incident.source?.module._id,
              label: incident.source?.module.name,
            }
          : {
              value: null,
              label: "Select supplier",
            },
    },
    errors: {},
  };
}

export function mapToIncidentResolutionModel(incident) {
  return {
    data: {
      resolution: incident.resolution,
      resolveStatus: incident.resolved.status,
    },
    errors: {},
  };
}
export function linkISOControl(auditId, data) {
  return http.post(`${apiEndPoint}/${auditId}/iso-controls`, {
    controls: data.controls,
    toolkits: data.toolkits,
  });
}
export function removeISOControl(auditId, data) {
  return http.put(`${apiEndPoint}/${auditId}/iso-controls`, {
    controls: data.controls,
    toolkits: data.toolkits,
  });
}
