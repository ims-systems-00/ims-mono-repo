import http from "./httpServices";
import { getCurrentSessionData } from "./authService";

const apiEndPoint = `/api/${process.env.REACT_APP_API_VERSION}/license-requests`;

export function makeLicenseRequest(data) {
  return http.post(`${apiEndPoint}/`, {
    superUser: data.superUser,
    groups: data.groupAmount,
    users: data.userAmount,
    message: data.message,
    additionalModules: data.additionalModules.map((module) => module.value),
    complianceTools: data.complianceTools.map((tool) => tool.value),
    projectims: data.projectims,
    carbocalc: data.carbocalc,
    imsforms: data.imsforms,
    createdBy: getCurrentSessionData().user._id,
  });
}
export function getLicensesRequests({ query }) {
  return http.get(`${apiEndPoint}/?${query}`);
}

export function getLicensesRequest(requestId) {
  return http.get(`${apiEndPoint}/${requestId}`);
}

export function handleRequestApproval(requestId, query) {
  return http.put(`${apiEndPoint}/${requestId}/?${query}`);
}
