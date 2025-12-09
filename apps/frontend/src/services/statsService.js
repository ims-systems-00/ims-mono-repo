import moment from "moment";
import http from "./httpServices";
moment().format();

const apiEndPoint = `/api/${process.env.REACT_APP_API_VERSION}/stats`;

export function getGlobalStats() {
  return http.get(`${apiEndPoint}/global`);
}
export function getDigitalMaturity() {
  return http.get(`${apiEndPoint}/digital-maturity`);
}

export function getComplianceStats() {
  return http.get(`${apiEndPoint}/compliance`);
}

export function getAuditStats() {
  return http.get(`${apiEndPoint}/audit`);
}

export function getRiskStats() {
  return http.get(`${apiEndPoint}/risk`);
}

export function getIncidentStats() {
  return http.get(`${apiEndPoint}/incident`);
}

export function getInventoryStats() {
  return http.get(`${apiEndPoint}/inventory`);
}

export function getSupplierStats() {
  return http.get(`${apiEndPoint}/supplier`);
}

export function getCipStats() {
  return http.get(`${apiEndPoint}/cip`);
}

export function getCrmStats() {
  return http.get(`${apiEndPoint}/crm`);
}
