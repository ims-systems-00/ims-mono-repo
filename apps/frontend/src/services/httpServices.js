import axios from "axios";
const HTTP_DEFAULT = axios.create({
  withCredentials: true,
  baseURL: process.env.REACT_APP_API_URL,
});

function setUserAccessWithJWT(accessToken) {
  HTTP_DEFAULT.defaults.headers.common["x-auth-accesstoken"] = accessToken;
}
function setLimitedAccessWithJWT(token, cid) {
  HTTP_DEFAULT.defaults.headers.common["x-auth-limited-accesstoken"] = token;
  HTTP_DEFAULT.defaults.headers.common["x-auth-limited-cid"] = cid;
}

function setOrganisationAccess(orgid) {
  HTTP_DEFAULT.defaults.headers.common["x-org-id"] = orgid;
}
function setBusinessUnitAccess(id) {
  HTTP_DEFAULT.defaults.headers.common["x-group-id"] = id;
}

let http = {
  instance: HTTP_DEFAULT,
  get: HTTP_DEFAULT.get,
  post: HTTP_DEFAULT.post,
  put: HTTP_DEFAULT.put,
  patch: HTTP_DEFAULT.patch,
  delete: HTTP_DEFAULT.delete,
  setUserAccessWithJWT,
  setLimitedAccessWithJWT,
  setOrganisationAccess,
  setBusinessUnitAccess,
};
export default http;
