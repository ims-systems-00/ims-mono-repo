import { getCurrentSessionData } from "./authService";
import http from "./httpServices";
const apiEndPoint = `/api/${process.env.REACT_APP_API_VERSION}/cips`;

export function getCIPs({ query }) {
  return http.get(`${apiEndPoint}/?${query}`);
}
export function getCIP(cipId) {
  return http.get(`${apiEndPoint}/${cipId}`);
}
export function createCIP(cip) {
  return http.post(`${apiEndPoint}/`, {
    ...cip,
  });
}
export function updateCIP(cipId, cip) {
  return http.put(`${apiEndPoint}/${cipId}`, {
    ...cip,
  });
}
export function implementCIP(cipId) {
  return http.put(`${apiEndPoint}/${cipId}/implementation`, {
    implementedBy: getCurrentSessionData().user._id,
  });
}
export function deleteCIP(cipId) {
  return http.delete(`${apiEndPoint}/${cipId}`);
}
export function removeAttachment(id, attachment_id) {
  return http.delete(`${apiEndPoint}/${id}/attachments/${attachment_id}`);
}

export function linkISOControl(cipId, data) {
  return http.post(`${apiEndPoint}/${cipId}/iso-controls`, {
    controls: data.controls,
    toolkits: data.toolkits,
  });
}

export function removeISOControl(cipId, data) {
  return http.put(`${apiEndPoint}/${cipId}/iso-controls`, {
    controls: data.controls,
    toolkits: data.toolkits,
  });
}
export function mapToCIPModel(cip) {
  return {
    data: {
      group: {
        value: cip.group?._id,
        label: cip.group?.name,
      },
      owner: cip.owner
        ? {
            value: cip.owner._id,
            label: cip.owner.name,
          }
        : {
            value: null,
            label: "Select owner",
          },
      title: cip.title,
      cost: cip.cost,
      opportunityForImprovement: cip.opportunityForImprovement,
      attachments: [],
    },
    errors: {},
  };
}
