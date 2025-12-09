import { getCurrentSessionData } from "@/services/authService";
import http from "../httpServices";
import moment from "moment";
const apiEndPoint = `/api/${process.env.REACT_APP_API_VERSION}/wallets/leaves`;

export function getLeaves({ query }) {
  return http.get(`${apiEndPoint}/?${query}`);
}
export function getHolidays({ query }) {
  return http.get(`${apiEndPoint}/holidays/?${query}`);
}
export function createLeave(leave) {
  return http.post(`${apiEndPoint}/`, {
    type: leave.type.value,
    submission: {
      status: leave.ongoing ? "Ongoing" : "Draft",
    },
    description: leave.description,
    startDate: new Date(moment(`${leave.startDate}`, "DD/MM/YYYY hh:mm a")),
    startDayFraction: leave.startDayFraction.value,
    endDate: new Date(moment(`${leave.endDate}`, "DD/MM/YYYY hh:mm a")),
    endDayFraction: leave.endDayFraction.value,
  });
}
export function updateLeave(leaveId, leave) {
  return http.put(`${apiEndPoint}/${leaveId}`, {
    type: leave.type.value,
    description: leave.description,
    startDate: new Date(moment(`${leave.startDate}`, "DD/MM/YYYY hh:mm a")),
    startDayFraction: leave.startDayFraction?.value,
    endDate: new Date(moment(`${leave.endDate}`, "DD/MM/YYYY hh:mm a")),
    endDayFraction: leave.endDayFraction?.value,
  });
}
export function getLeave(leaveId) {
  return http.get(`${apiEndPoint}/${leaveId}`);
}
export function deleteLeave(leaveId) {
  return http.delete(`${apiEndPoint}/${leaveId}`);
}
export function submitLeave(leaveId) {
  return http.patch(`${apiEndPoint}/${leaveId}/submission`);
}
export function evaluateLeave(leaveId, { decision }) {
  return http.patch(`${apiEndPoint}/${leaveId}/evaluation`, {
    decision: decision,
  });
}

export function mapToLeaveModel(leave) {
  return {
    data: {
      type: {
        value: leave.type,
        label: leave.type,
      },
      startDayFraction: {
        value: leave.startDayFraction,
        label: leave.startDayFraction,
      },
      endDayFraction: {
        value: leave.endDayFraction,
        label: leave.endDayFraction,
      },
      description: leave.description,
      startDate: moment(leave.startDate).format("DD/MM/YYYY"),
      endDate: moment(leave.endDate).format("DD/MM/YYYY"),
    },
    errors: {},
  };
}
