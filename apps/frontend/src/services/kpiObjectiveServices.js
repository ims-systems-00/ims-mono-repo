import { getCurrentSessionData } from "./authService";
import http from "./httpServices";
import { getCurrentUserInfo } from "./userServices";
const apiEndPoint = `/api/${process.env.REACT_APP_API_VERSION}/kpiobjectives`;

export function createKpiObjective(kpiObjective) {
  return http.post(`${apiEndPoint}/`, {
    group:
      kpiObjective.privacy.value === "Orgnisational"
        ? null
        : kpiObjective.group.value,
    value: kpiObjective.value,
    privacy: kpiObjective.privacy.value,
    createdBy: getCurrentSessionData().user._id,
  });
}
export function updateKpiObjective(kpiObjectiveId, kpiObjective) {
  return http.put(`${apiEndPoint}/${kpiObjectiveId}`, {
    value: kpiObjective.value,
    privacy: kpiObjective.privacy.value,
  });
}
export function getKpiObjectives() {
  return http.get(`${apiEndPoint}/`);
}
export function getKpiObject(kpiObjectiveId) {
  return http.get(`${apiEndPoint}/${kpiObjectiveId}`);
}
export function deleteKpiObjective(kpiObjectiveId) {
  return http.delete(`${apiEndPoint}/${kpiObjectiveId}`);
}
export function mapToKpiObjectiveModel(data) {
  return {
    data: {
      value: data.value,
      group: data.group
        ? {
            value: data.group._id,
            label: data.group.name,
          }
        : {
            value: null,
            label: "Select group",
          },
      privacy: {
        value: data.privacy,
        label: data.privacy,
      },
    },
    errors: {},
  };
}
