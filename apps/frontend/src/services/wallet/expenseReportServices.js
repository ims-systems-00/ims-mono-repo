import { getCurrentSessionData } from "@/services/authService";
import http from "../httpServices";
import moment from "moment";
const apiEndPoint = `/api/${process.env.REACT_APP_API_VERSION}/wallets/expensereports`;

export function createExpenseReport(expense) {
  return http.post(`${apiEndPoint}/`, {
    title: expense.title,
    description: expense.description,
    currency: expense.currency.value,
  });
}
export function getExpenseReports({ query }) {
  return http.get(`${apiEndPoint}/?${query}`);
}
export function getExpenseReport(reportId) {
  return http.get(`${apiEndPoint}/${reportId}`);
}
export function updateExpenseReport(reportId, expense) {
  return http.put(`${apiEndPoint}/${reportId}`, {
    title: expense.title,
    description: expense.description,
    currency: expense.currency.value,
  });
}
export function deleteExpenseReport(reportId) {
  return http.delete(`${apiEndPoint}/${reportId}`);
}
export function includeExpense(reportId, expense) {
  return http.post(`${apiEndPoint}/${reportId}/expenses`, {
    type: expense.type,
    cost: expense.cost,
    description: expense.description,
    attachments: expense.attachments,
  });
}
export function updateExpense(reportId, expenseId, expense) {
  return http.put(`${apiEndPoint}/${reportId}/expenses/${expenseId}`, {
    type: expense.type,
    cost: expense.cost,
    description: expense.description,
    attachments: expense.attachments,
  });
}
export function deleteExpense(reportId, expenseId) {
  return http.delete(`${apiEndPoint}/${reportId}/expenses/${expenseId}`);
}
export function deleteExpenseAttachment(reportId, expenseId, attachmentId) {
  return http.delete(
    `${apiEndPoint}/${reportId}/expenses/${expenseId}/attachment/${attachmentId}`
  );
}
export function includeTravel(reportId, travel) {
  return http.post(`${apiEndPoint}/${reportId}/travels`, {
    type: travel.type.value,
    transport: travel.transport.value,
    from: travel.from,
    to: travel.to,
    distance: travel.distance / 1000,
    cost: travel.cost,
    notes: travel.notes,
    attachments: travel.attachments,
  });
}
export function updateTravel(reportId, travelId, travel) {
  return http.put(`${apiEndPoint}/${reportId}/travels/${travelId}`, {
    type: travel.type.value,
    transport: travel.transport.value,
    from: travel.from,
    to: travel.to,
    distance: travel.distance,
    cost: travel.cost,
    notes: travel.notes,
    attachments: travel.attachments,
  });
}
export function deleteTravel(reportId, travelId) {
  return http.delete(`${apiEndPoint}/${reportId}/travels/${travelId}`);
}

export function deleteTravelAttachment(reportId, travelId, attachmentId) {
  return http.delete(
    `${apiEndPoint}/${reportId}/travels/${travelId}/attachment/${attachmentId}`
  );
}

export function includeAccommodation(reportId, accommodation) {
  return http.post(`${apiEndPoint}/${reportId}/accommodations`, {
    notes: accommodation.notes,
    location: accommodation.location,
    type: accommodation.type,
    checkin: new Date(moment(`${accommodation.checkin}`, "DD/MM/YYYY hh:mm a")),
    checkout: new Date(
      moment(`${accommodation.checkout}`, "DD/MM/YYYY hh:mm a")
    ),
    cost: accommodation.cost,
    attachments: accommodation.attachments,
  });
}
export function updateAccommodation(reportId, accommodationId, accommodation) {
  return http.put(
    `${apiEndPoint}/${reportId}/accommodations/${accommodationId}`,
    {
      notes: accommodation.notes,
      location: accommodation.location,
      type: accommodation.type,
      checkin: new Date(
        moment(`${accommodation.checkin}`, "DD/MM/YYYY hh:mm a")
      ),
      checkout: new Date(
        moment(`${accommodation.checkout}`, "DD/MM/YYYY hh:mm a")
      ),
      cost: accommodation.cost,
      attachments: accommodation.attachments,
    }
  );
}
export function deleteAccommodation(reportId, accommodationId) {
  return http.delete(
    `${apiEndPoint}/${reportId}/accommodations/${accommodationId}`
  );
}
export function deleteAccommodationAttachment(
  reportId,
  accommodationId,
  attachmentId
) {
  return http.delete(
    `${apiEndPoint}/${reportId}/accommodations/${accommodationId}/attachment/${attachmentId}`
  );
}

export function submitReport(reportId) {
  return http.patch(`${apiEndPoint}/${reportId}/submission`);
}
export function evaluateReport(reportId, { decision }) {
  return http.patch(`${apiEndPoint}/${reportId}/evaluation`, {
    decision: decision,
  });
}

export function mapToExpenseReportModel(data) {
  return {
    data: {
      title: data.title,
      description: data.description,
      currency: {
        value: data.currency,
        label: data.currency,
      },
    },
    errors: {},
  };
}

export function mapToTravelModel(travel) {
  return {
    data: {
      type: {
        value: travel.type,
        label: travel.type,
      },
      transport: {
        value: travel.transport,
        label: travel.transport,
      },
      distance: travel.distance,
      cost: travel.cost,
      from: travel.from,
      to: travel.to,
      notes: travel.notes,
      attachments: travel.attachments,
    },
    errors: {},
  };
}
export function mapToExpenseModel(expense) {
  return {
    data: {
      type: {
        value: expense.type,
        label: expense.type,
      },
      cost: expense.cost,
      description: expense.description,
      attachments: expense.attachments,
    },
    errors: {},
  };
}
export function mapToAccommodationModel(accommodation) {
  return {
    data: {
      type: accommodation.type,
      location: accommodation.location,
      checkin: moment(accommodation.checkin).format("D/M/Y"),
      checkout: moment(accommodation.checkout).format("D/M/Y"),
      cost: accommodation.cost,
      notes: accommodation.notes,
      attachments: accommodation.attachments,
    },
    errors: {},
  };
}
