import http from "../httpServices";
const apiEndPoint = `/api/${process.env.REACT_APP_API_VERSION}/document-trees`;

export function listNodes({ query }) {
  return http.get(`${apiEndPoint}/?${query}`);
}
