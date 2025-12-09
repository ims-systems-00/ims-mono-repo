import http from "./httpServices";
import moment from "moment";
import { getCurrentSessionData } from "./authService";
const apiEndPoint = `/api/${process.env.REACT_APP_API_VERSION}/audits`;

export function getAudits({ query }) {
  return http.get(`${apiEndPoint}/?${query}`);
}
export function getAudit(auditId) {
  return http.get(`${apiEndPoint}/${auditId}`);
}
export function createAudit(audit) {
  return http.post(`${apiEndPoint}/`, {
    auditor: audit.auditor.value,
    group: audit.group?.value,
    complianceBody: audit.complianceBody?.value,
    startDate: new Date(
      moment(`${audit.startDate} ${audit.time}`, "DD/MM/YYYY hh:mm a")
    ),
    time: audit.time,
    type: audit.type,
    title: audit.title,
    focusArea: audit.focusArea,
    attachments: audit.attachments,
    interval: audit.interval.value,
  });
}
export function updateAudit(auditId, audit) {
  return http.put(`${apiEndPoint}/${auditId}`, {
    group: audit.group?.value,
    complianceBody: audit.complianceBody?.value,
    title: audit.title,
    startDate: new Date(
      moment(`${audit.startDate} ${audit.time}`, "DD/MM/YYYY hh:mm a")
    ),
    time: audit.time,
    focusArea: audit.focusArea,
    attachments: audit.attachments,
    comment: audit.comment,
  });
}
export function deleteAudit(auditId) {
  return http.delete(`${apiEndPoint}/${auditId}/`);
}
export function completeAudit(auditId) {
  return http.put(`${apiEndPoint}/${auditId}/accomplishment`, {
    completedBy: getCurrentSessionData().user._id,
  });
}
export function mapToAuditModel(audit) {
  return {
    data: {
      type: audit.type,
      title: audit.title,
      focusArea: audit.focusArea,
      group: {
        value: audit.group?._id,
        label: audit.group?.name,
      },
      complianceBody: {
        value: audit.complianceBody?._id,
        label: audit.complianceBody?.name,
      },
      auditor: audit.auditor && {
        value: audit.auditor._id,
        label: audit.auditor.name,
      },
      startDate: moment(audit.startDate).format("DD/MM/YYYY"),
      time: moment(audit.startDate).format("HH:MM"),
      interval: {
        value: audit.interval,
        label: audit.interval,
      },
      comment: audit.comment,
      attachments: [],
    },
    errors: {},
  };
}
export function mapToAuditIdentificationModel(data) {
  return {
    data: {
      rootCause: data.rootCause,
      nonConformity: data.nonConformity,
    },
    errors: {},
  };
}
export function addIdentifications(auditId, data) {
  return http.post(`${apiEndPoint}/${auditId}/identifications/`, {
    rootCause: data.rootCause,
    nonConformity: data.nonConformity,
  });
}
export function updateIdentifications(auditId, identificationId, data) {
  return http.put(
    `${apiEndPoint}/${auditId}/identifications/${identificationId}`,
    {
      rootCause: data.rootCause,
      nonConformity: data.nonConformity,
    }
  );
}
export function deleteIdentifications(auditId, identifier) {
  return http.delete(`${apiEndPoint}/${auditId}/identifications/${identifier}`);
}
export function addRisk(auditId, data) {
  return http.post(`${apiEndPoint}/${auditId}/risks/`, {
    title: data.riskTitle,
    description: data.riskDescription,
    likelihood: parseInt(data.likelihood.value),
    consequence: parseInt(data.consequence.value),
  });
}
export function updateRisk(auditId, identificationId, data) {
  return http.put(`${apiEndPoint}/${auditId}/risks/${identificationId}`, {
    title: data.riskTitle,
    description: data.riskDescription,
    likelihood: parseInt(data.likelihood.value),
    consequence: parseInt(data.consequence.value),
  });
}
export function deleteRisk(auditId, identifier) {
  return http.delete(`${apiEndPoint}/${auditId}/risks/${identifier}`);
}
export function mapToAuditRiskModel(data) {
  return {
    data: {
      riskTitle: data.title,
      riskDescription: data.description,
      consequence: {
        value: data.score.consequence,
        label: data.score.consequence,
      },
      likelihood: {
        value: data.score.likelihood,
        label: data.score.likelihood,
      },
    },
    errors: {},
  };
}
export function mapToAuditCipModel(data) {
  return {
    data: {
      ofiTitle: data.title,
      opportunityForImprovement: data.opportunityForImprovement,
    },
    errors: {},
  };
}

export function addOfi(auditId, data) {
  return http.post(`${apiEndPoint}/${auditId}/ofis/`, {
    title: data.ofiTitle,
    opportunityForImprovement: data.opportunityForImprovement,
  });
}
export function updateOfi(auditId, identificationId, data) {
  return http.put(`${apiEndPoint}/${auditId}/ofis/${identificationId}`, {
    title: data.ofiTitle,
    opportunityForImprovement: data.opportunityForImprovement,
  });
}
export function deleteOfi(auditId, identifier) {
  return http.delete(`${apiEndPoint}/${auditId}/ofis/${identifier}`);
}
export function addAuditDocuments(auditId, data) {
  return http.post(`${apiEndPoint}/${auditId}/attachments`, {
    attachment: data.attachment,
  });
}
export function deleteAuditDocument(auditId, documentId) {
  return http.delete(`${apiEndPoint}/${auditId}/attachments/${documentId}`);
}
export function extractReport(auditId, value) {
  return http.post(`${apiEndPoint}/${auditId}/reports`, {
    name: value.person,
    email: value.personEmail,
    sender: getCurrentSessionData().user,
  });
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
