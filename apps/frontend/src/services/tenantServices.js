import http from "./httpServices";
const apiEndPoint = `/api/${process.env.REACT_APP_API_VERSION}/tenants`;

export function getTenants({ query }) {
  return http.get(`${apiEndPoint}/?${query}`);
}
