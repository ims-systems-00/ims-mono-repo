import http from "./httpServices";
import moment from "moment";
import { getCurrentSessionData } from "./authService";

const apiEndPoint = `/api/${process.env.REACT_APP_API_VERSION}/events`;

export function createEvent(event) {
  return http.post(`${apiEndPoint}/`, {
    group: null,
    createdBy: getCurrentSessionData().user._id,
    title: event.title,
    description: event.description,
    start: event.start,
    end: event.end,
    color: event.color,
  });
}
export function getEvents() {
  return http.get(`${apiEndPoint}/?userId=${getCurrentSessionData().user._id}`);
}
export function getEvent(eventId) {
  return http.get(`${apiEndPoint}/${eventId}`);
}
export function updateCalenderEvent(eventId, event) {
  return http.put(`${apiEndPoint}/${eventId}`, {
    title: event.title,
    description: event.description,
    start: event.start,
    end: event.end,
  });
}
export function deleteEvent(eventId) {
  return http.delete(`${apiEndPoint}/${eventId}`);
}
export function mapToCalenderEventModel(event) {
  return {
    data: {
      title: event.title,
      description: event.resource && event.resource.description,
      startTime: moment(event.start).format("HH:mm"),
      endTime: moment(event.end).format("HH:mm"),
    },
    errors: {},
  };
}
export function mapToCalenderFormat(event) {
  return {
    title: event.title,
    resource: {
      _id: event._id,
      description: event.description,
      systemEventId: event.systemEventId,
    },
    color: event.color,
    start: new Date(event.start),
    end: new Date(event.end),
  };
}
