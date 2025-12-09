import http from "../httpServices";
const apiEndPoint = `/api/${process.env.REACT_APP_API_VERSION}/ai/responses`;

export function createAIResponse(data) {
  return http.post(`${apiEndPoint}/`, {
    module: data.module,
    moduleType: data.moduleType,
    template: data.template,
  });
}
export function listAIResponses({ query }) {
  return http.get(`${apiEndPoint}/?${query}`);
}
export function getAIResponse(id) {
  return http.get(`${apiEndPoint}/${id}/`);
}
export function updateAIResponse(id, data) {
  return http.put(`${apiEndPoint}/${id}`, {
    template: data.template,
  });
}
export function deleteAIResponse(id) {
  return http.delete(`${apiEndPoint}/${id}/`);
}
