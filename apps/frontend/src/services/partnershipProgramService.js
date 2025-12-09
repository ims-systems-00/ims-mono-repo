import http from "./httpServices";
const apiEndPoint = `/api/${process.env.REACT_APP_API_VERSION}/ims-partnership`;

export function createPartnership(data) {
  return http.post(`${apiEndPoint}/`, {
    serviceProvision: data.serviceProvision,
    customerReach: data.customerReach,
    website: data.website,
    standards: data.standards,
    description: data.description,
  });
}
export function listPartnerships() {
  return http.get(`${apiEndPoint}/`);
}
export function getPartnership(id) {
  return http.get(`${apiEndPoint}/${id}`);
}
export function getAnalyticsByPartnership(id) {
  return http.get(`${apiEndPoint}/${id}/analytics`);
}
