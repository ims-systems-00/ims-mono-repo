import http from "./httpServices";
import moment from "moment";
import { getCurrentSessionData } from "./authService";
const apiEndPoint = `/api/${process.env.REACT_APP_API_VERSION}/statics`;

export function getConstants({ query }) {
  return http.get(`${apiEndPoint}/?${query}`);
}
