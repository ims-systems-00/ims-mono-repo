import { getCurrentSessionData } from "@/services/authService";
import http from "../httpServices";
import moment from "moment";
const apiEndPoint = `/api/${process.env.REACT_APP_API_VERSION}/wallets/worklog`;

const workLogKey = "workLog";

export function getWorkLogs({ query }) {
  return http.get(`${apiEndPoint}/?${query}`);
}

export function getWorkLog(logId) {
  return http.get(`${apiEndPoint}/${logId}`);
}

export function clockIn(data) {
  return http.post(`${apiEndPoint}/`, {
    type: data.isRemote ? "Remote" : "On-site",
    location: data.location.value,
    priorities: data.priorities,
  });
}

export function toggleStatus() {
  return http.patch(`${apiEndPoint}/togglepause`);
}

export function clockOut(data) {
  return http.patch(`${apiEndPoint}/`, {
    achievements: data.achievements,
  });
}

export function getActiveLog() {
  return http.get(`${apiEndPoint}/active`);
}

export function setWorkLogCache(data) {
  localStorage.setItem(workLogKey, data);
}
export function getWorkLogCache() {
  return localStorage.getItem(workLogKey);
}
export function refreshWorkLogCache(data) {
  localStorage.setItem(workLogKey, data);
}
