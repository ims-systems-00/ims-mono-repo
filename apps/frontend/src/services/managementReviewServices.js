import http from "./httpServices";
import moment from "moment";
import { getCurrentSessionData } from "./authService";
const apiEndPoint = `/api/${process.env.REACT_APP_API_VERSION}/managementreviews`;

export function getManagementReviews({ query }) {
  return http.get(`${apiEndPoint}/?${query}`);
}
export function getManagementReview(managementReviewId) {
  return http.get(`${apiEndPoint}/${managementReviewId}`);
}
export function createManagementReview(managementReview) {
  return http.post(`${apiEndPoint}/`, {
    group:
      managementReview.privacy.value === "Orgnisational"
        ? null
        : managementReview.group.value,
    date: new Date(
      moment(
        `${managementReview.date} ${managementReview.time}`,
        "DD/MM/YYYY hh:mm a"
      )
    ),
    time: managementReview.time,
    title: managementReview.title,
    interval: managementReview.interval.value,
    privacy: managementReview.privacy.value,
    agenda: managementReview.agenda,
    minutes: managementReview.minutes,
    attendees: managementReview.attendees.map((attendee) => attendee.value),
  });
}
export function updateManagementReview(managementReviewId, managementReview) {
  return http.put(`${apiEndPoint}/${managementReviewId}`, {
    date: new Date(
      moment(
        `${managementReview.date} ${managementReview.time}`,
        "DD/MM/YYYY hh:mm a"
      )
    ),
    time: managementReview.time,
    title: managementReview.title,
    privacy: managementReview.privacy.value,
    agenda: managementReview.agenda,
    minutes: managementReview.minutes,
    attendees: managementReview.attendees.map((attendee) => attendee.value),
  });
}
export function addAgenda(managementReviewId, data) {
  return http.post(`${apiEndPoint}/${managementReviewId}/attachments/agenda`, {
    agenda: data.agenda,
  });
}
export function deleteAgenda(managementReviewId, agendaId) {
  return http.delete(
    `${apiEndPoint}/${managementReviewId}/attachments/agenda/${agendaId}`
  );
}
export function addMinutes(managementReviewId, data) {
  return http.post(`${apiEndPoint}/${managementReviewId}/attachments/minutes`, {
    minutes: data.minutes,
  });
}
export function deleteMinutes(managementReviewId, minutesId) {
  return http.delete(
    `${apiEndPoint}/${managementReviewId}/attachments/minutes/${minutesId}`
  );
}

export function completeManagementReview(managementReviewId, managementReview) {
  return http.put(`${apiEndPoint}/${managementReviewId}/accomplishment`, {
    completedBy: getCurrentSessionData().user._id,
  });
}
export function deleteManagementReview(managementReviewId) {
  return http.delete(`${apiEndPoint}/${managementReviewId}`);
}
export function mapToManagementReviewModel(data) {
  return {
    data: {
      title: data.title,
      group: data.group
        ? {
            value: data.group._id,
            label: data.group.name,
          }
        : {
            value: null,
            label: "Select business unit",
          },
      date: moment(data.date).format("DD/MM/YYYY"),
      interval: {
        value: data.interval,
        label: data.interval,
      },
      privacy: {
        value: data.privacy,
        label: data.privacy,
      },
      time: moment(data.date).format("HH:MM"),
      minutes: [],
      agenda: [],
      attendees: data.attendees
        .filter((attendee) => attendee)
        .map((attendee) => ({ value: attendee._id, label: attendee.name })),
    },
    errors: {},
  };
}
export function addAttendee(reviewId, attendee) {
  return http.post(`${apiEndPoint}/${reviewId}/attendees`, {
    attendee: {
      name: attendee.name,
    },
  });
}
export function deleteAttendee(reviewId, attendeeId) {
  return http.delete(`${apiEndPoint}/${reviewId}/attendees/${attendeeId}`);
}

export function mapToKpiObjectiveModel(data) {
  return {
    data: {
      kpiObjectives: data,
      kpiObjective: "",
    },
    errors: {},
  };
}
export function mapToAttendeeModel(data) {
  return {
    data: {
      attendee: data.name,
    },
    errors: {},
  };
}
