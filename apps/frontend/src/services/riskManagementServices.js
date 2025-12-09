import { getCurrentSessionData } from "./authService";
import http from "./httpServices";

const apiEndPoint = `/api/${process.env.REACT_APP_API_VERSION}/risks`;

export function createRisk(risk) {
  return http.post(`${apiEndPoint}/`, {
    ...risk,
  });
}
export function getRisks({ query }) {
  const url = query ? `${apiEndPoint}?${query}` : apiEndPoint;
  return http.get(url);
}

export function getCSVReport({ query }) {
  return http.get(`${apiEndPoint}/reports/downloads/?${query}`, {
    responseType: "arraybuffer",
  });
}
export function getRisk(riskId) {
  return http.get(`${apiEndPoint}/${riskId}/`);
}
export function updateRisk(riskId, risk) {
  return http.put(`${apiEndPoint}/${riskId}`, {
    ...risk,
  });
}
export function controlMitigateRisk(riskId, risk) {
  return http.put(`${apiEndPoint}/${riskId}/controls-mitigation/`, {
    mitigatedBy: getCurrentSessionData().user._id,
    controlsAndMitigation: risk.controlsAndMitigation,
    mitigationStatus: risk.mitigationStatus,
  });
}
export function acceptRisk(riskId, risk) {
  return http.put(`${apiEndPoint}/${riskId}/acceptance-rational/`, {
    acceptanceRational: risk.acceptanceRational,
    decisionMaker: risk.decisionMaker,
    acceptedBy: getCurrentSessionData().user._id,
    acceptanceStatus: risk.acceptanceStatus,
  });
}
export function escalateRisk(riskId) {
  return http.put(`${apiEndPoint}/${riskId}/escalation/`, {
    escalatedBy: getCurrentSessionData().user._id,
  });
}

export function deleteRisk(riskId) {
  return http.delete(`${apiEndPoint}/${riskId}`);
}
export function removeAttachment(riskId, attachment_id) {
  return http.delete(`${apiEndPoint}/${riskId}/attachments/${attachment_id}`);
}
export function mapToRiskModel(risk) {
  return {
    data: {
      type: risk.type
        ? {
            value: risk.type,
            label: risk.type,
          }
        : {
            value: null,
            label: "Select type",
          },
      group: {
        value: risk.group?._id,
        label: risk.group?.name,
      },
      asset: risk.asset
        ? {
            value: risk.asset._id,
            label: risk.asset.name,
          }
        : {
            value: null,
            label: "Select asset",
          },
      title: risk.title,
      description: risk.description,
      consequence: {
        value: risk.score.consequence.current,
        label: risk.score.consequence.current,
      },
      likelihood: {
        value: risk.score.likelihood.current,
        label: risk.score.likelihood.current,
      },
      owner: risk.owner
        ? {
            value: risk.owner._id,
            label: risk.owner.name,
          }
        : {
            value: null,
            label: "Select owner",
          },
      tagsAndCategories: {
        value: risk.tagsAndCategories?._id,
        label: risk.tagsAndCategories?.name,
      },
      controlsAndMitigation: risk.controlsAndMitigation,
      mitigationStatus: risk.mitigated.status,
      acceptanceRational: risk.acceptanceRational,
      decisionMaker: risk.decisionMaker,
      acceptanceStatus: risk.accepted.status,
      attachments: [],
    },
    errors: {},
  };
}
export function mapToRiskMitigationModel(risk) {
  return {
    data: {
      controlsAndMitigation: risk.controlsAndMitigation,
      mitigationStatus: risk.mitigated.status,
    },
    errors: {},
  };
}
export function mapToAcceptRiskModel(risk) {
  return {
    data: {
      acceptanceRational: risk.acceptanceRational,
      decisionMaker: risk.decisionMaker,
      acceptanceStatus: risk.accepted.status,
    },
    errors: {},
  };
}
export function linkISOControl(riskId, data) {
  return http.post(`${apiEndPoint}/${riskId}/iso-controls`, {
    controls: data.controls,
    toolkits: data.toolkits,
  });
}
export function removeISOControl(riskId, data) {
  return http.put(`${apiEndPoint}/${riskId}/iso-controls`, {
    controls: data.controls,
    toolkits: data.toolkits,
  });
}
