import { getCurrentSessionData } from "./authService";
import http from "./httpServices";
const apiEndPoint = `/api/${process.env.REACT_APP_API_VERSION}/notifications`;
export function createNotification(data) {
  return http.post(`${apiEndPoint}/`, {
    message: data.message,
    audience: data.audience.value,
    createdBy: getCurrentSessionData().user._id,
  });
}

export function updateNotificationSentStatus() {
  return http.put(
    `${apiEndPoint}/sent-status/${getCurrentSessionData().user._id}`
  );
}

export function UpdateNotificationReadStatus(notificationId) {
  return http.put(`${apiEndPoint}/read-status/${notificationId}`);
}

export function getNotifications({ query }) {
  return http.get(`${apiEndPoint}/?${query}`);
}

export function getNotification(id) {
  return http.get(`${apiEndPoint}/${id}`);
}

export function updatePopupStatus(notificationId) {
  return http.put(`${apiEndPoint}/popup-status/${notificationId}`);
}
export function updateBulkPopupStatus() {
  return http.put(
    `${apiEndPoint}/popup-status/bulk/${getCurrentSessionData().user._id}`
  );
}
export function nudgePeople(moduleName, dataId, type) {
  return http.post(`${apiEndPoint}/nudge-people/`, {
    moduleName: moduleName,
    dataId: dataId,
    notificationType: type,
  });
}
