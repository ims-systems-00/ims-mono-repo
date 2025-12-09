import { getCurrentSessionData } from "./authService";
import moment from "moment";
import http from "./httpServices";
const apiEndPoint = `/api/${process.env.REACT_APP_API_VERSION}/cqc`;

export function createComplaint(compliant) {
  return http.post(`${apiEndPoint}/compliants`, {
    group: compliant.group.value,
    name: compliant.name,
    address: compliant.address,
    telephone: compliant.telephone,
    email: compliant.email,
    preferredCommunicationMethod: compliant.preferredCommunicationMethod,
    dateAndTimeOfIncident: new Date(
      moment(compliant.dateAndTimeOfIncident, "DD/MM/YYYY")
        .toString()
        .split("GMT")[0]
    ),
    nameOfEmployee: compliant.nameOfEmployee,
    typeOfService: compliant.typeOfService,
    detail: compliant.detail,
    attachments: compliant.attachments.map((attachment) => attachment),
    createdBy: getCurrentSessionData().user._id,
  });
}

export function updateComplaint(compliantId, compliant) {
  return http.put(`${apiEndPoint}/compliants/${compliantId}`, {
    group: compliant.group.value,
    name: compliant.name,
    address: compliant.address,
    telephone: compliant.telephone,
    email: compliant.email,
    preferredCommunicationMethod: compliant.preferredCommunicationMethod,
    dateAndTimeOfIncident: new Date(
      moment(compliant.dateAndTimeOfIncident, "DD/MM/YYYY")
        .toString()
        .split("GMT")[0]
    ),
    nameOfEmployee: compliant.nameOfEmployee,
    typeOfService: compliant.typeOfService,
    detail: compliant.detail,
    investigator: compliant.investigator.value,
    investigation: compliant.investigation,
    actions: compliant.actions,
    outcome: compliant.outcome,
    referredToSomeoneElse: compliant.referredToSomeoneElse,
    referredInvestigator: compliant.referredInvestigator.value,
    referredActions: compliant.referredActions,
    referredOutcome: compliant.referredOutcome,
    nameOfOrganisation: compliant.nameOfOrganisation,
    signatureStatus: compliant.signatureStatus,
    attachments: compliant.attachments.map((attachment) => attachment),
  });
}

export function getComplaints({ query }) {
  return http.get(`${apiEndPoint}/compliants/?${query}`);
}
export function getCSVReport({ query }) {
  return http.get(`${apiEndPoint}/spreadsheets/compliants/?${query}`, {
    responseType: "arraybuffer",
  });
}
export function getComplaint(compliantId) {
  return http.get(`${apiEndPoint}/compliants/${compliantId}`);
}

export function deleteComplaint(compliantId) {
  return http.delete(`${apiEndPoint}/compliants/${compliantId}`);
}
export function deleteComplaintAttachments(compliantId, attachmentId) {
  return http.delete(
    `${apiEndPoint}/compliants/${compliantId}/attachments/${attachmentId}`
  );
}

export function getRatingsOverview({ query }) {
  return http.get(`${apiEndPoint}/overviews/?${query}`);
}

export function getRatingOverview(ratingId, { query }) {
  return http.get(`${apiEndPoint}/overviews/${ratingId}/?${query}`);
}

export function updateRating(rating, { query }) {
  return http.put(`${apiEndPoint}/overviews/?${query}`, {
    safe: rating.safe.value,
    effective: rating.effective.value,
    caring: rating.caring.value,
    responsive: rating.responsive.value,
    wellLed: rating.wellLed.value,
    overall: rating.overall.value,
  });
}

export function sendCqcNotice(notice, { query }) {
  return http.post(`${apiEndPoint}/notice/?${query}`, {
    title: notice.title,
    message: notice.message,
    audience: notice.audience.value,
    createdBy: getCurrentSessionData().user._id,
  });
}

export function buildCQCToolKit(data) {
  return http.post(`${apiEndPoint}/controls`, {
    group: data.group.value,
  });
}
export function getTool({ query }) {
  return http.get(`${apiEndPoint}/controls/?${query}`);
}
export function getControl(controlID) {
  return http.get(`${apiEndPoint}/controls/${controlID}`);
}

export function updateControl(controlID, data, { query }) {
  return http.put(`${apiEndPoint}/controls/${controlID}/?${query}`, {
    clause: data.clause,
    adopted: data.adopted.value,
  });
}

export function addToolComment(controlId, data) {
  return http.post(`${apiEndPoint}/controls/${controlId}/comments`, {
    value: data.comment,
    createdBy: getCurrentSessionData().user._id,
  });
}

export function updateToolComment(controlId, commentId, data) {
  return http.put(
    `${apiEndPoint}/controls/${controlId}/comments/${commentId}`,
    {
      value: data.comment,
    }
  );
}

export function deleteToolComment(controlId, commentId) {
  return http.delete(
    `${apiEndPoint}/controls/${controlId}/comments/${commentId}`
  );
}

export function addToolEvidence(controlId, data) {
  return http.post(`${apiEndPoint}/controls/${controlId}/evidences`, {
    evidences: data.docs.map((doc) => doc),
  });
}
export function deleteToolEvidence(controlId, evidenceId) {
  return http.delete(
    `${apiEndPoint}/controls/${controlId}/evidences/${evidenceId}`
  );
}

export function createSignificantEvent(event) {
  return http.post(`${apiEndPoint}/significantevents`, {
    group: event.group.value,
    dateOfEvent: new Date(
      moment(event.dateOfEvent, "DD/MM/YYYY").toString().split("GMT")[0]
    ),
    title: event.title,
    description: event.description,
    dateOfReviewMeeting: new Date(
      moment(event.dateOfReviewMeeting, "DD/MM/YYYY").toString().split("GMT")[0]
    ),
    presentPersonnel: event.presentPersonnel,
    positivePoints: event.positivePoints,
    keyIssues: event.keyIssues,
    areasOfConcern: event.areasOfConcern,
    attachments: event.attachments,
    createdBy: getCurrentSessionData().user._id,
  });
}

export function updateSignificantEvent(eventId, event) {
  return http.put(`${apiEndPoint}/significantevents/${eventId}`, {
    group: event.group.value,
    dateOfEvent: new Date(
      moment(event.dateOfEvent, "DD/MM/YYYY").toString().split("GMT")[0]
    ),
    title: event.title,
    description: event.description,
    dateOfReviewMeeting: new Date(
      moment(event.dateOfReviewMeeting, "DD/MM/YYYY").toString().split("GMT")[0]
    ),
    presentPersonnel: event.presentPersonnel,
    positivePoints: event.positivePoints,
    keyIssues: event.keyIssues,
    signatureStatus: event.signatureStatus,
    areasOfConcern: event.areasOfConcern,
    attachments: event.attachments,
    updatedBy: getCurrentSessionData().user._id,
  });
}

export function getSignificantEvents({ query }) {
  return http.get(`${apiEndPoint}/significantevents/?${query}`);
}

export function getSignificantEvent(eventId) {
  return http.get(`${apiEndPoint}/significantevents/${eventId}`);
}

export function deleteSignificantEvent(eventId) {
  return http.delete(`${apiEndPoint}/significantevents/${eventId}`);
}
export function deleteSignificantEventAttachment(id, attachment_id) {
  return http.delete(
    `${apiEndPoint}/significantevents/${id}/attachments/${attachment_id}`
  );
}

export function getSignificantEventsCSV() {
  return http.get(`${apiEndPoint}/spreadsheets/significantevents`);
}

export function addSignificantEventAction(eventId, event) {
  return http.post(
    `${apiEndPoint}/significantevents/${eventId}/planeofactions`,
    {
      value: event.action,
      assignedTo: event.assignedTo.value,
      createdBy: getCurrentSessionData().user._id,
    }
  );
}
export function UpdateSignificantEventAction(eventId, actionId, event) {
  return http.put(
    `${apiEndPoint}/significantevents/${eventId}/planeofactions/${actionId}`,
    {
      value: event.action,
      assignedTo: event.assignedTo.value,
    }
  );
}

export function deleteSignificantEvenAction(eventId, actionId) {
  return http.delete(
    `${apiEndPoint}/significantevents/${eventId}/planeofactions/${actionId}`
  );
}

export function createWhistleBlow(whistleBlow) {
  return http.post(`${apiEndPoint}/whistleblows`, {
    group: whistleBlow.group.value,
    reportedTo: whistleBlow.reportedTo.value,
    title: whistleBlow.title,
    dateOfIncident: new Date(
      moment(whistleBlow.dateOfIncident, "DD/MM/YYYY")
        .toString()
        .split("GMT")[0]
    ),
    description: whistleBlow.description,
    placeOfIncident: whistleBlow.placeOfIncident,
    involvedPersonnel: whistleBlow.involvedPersonnel.map(
      (personal) => personal.value
    ),
    opinion: whistleBlow.opinion,
    identity: whistleBlow.identity,
    statementOfDisclosureOne: whistleBlow.statementOfDisclosureOne,
    statementOfDisclosureTwo: whistleBlow.statementOfDisclosureTwo,
    statementOfDisclosureThree: whistleBlow.statementOfDisclosureThree,
    createdBy: getCurrentSessionData().user._id,
  });
}

export function updateWhistleBlow(whistleBlowId, whistleBlow) {
  return http.put(`${apiEndPoint}/whistleblows/${whistleBlowId}`, {
    group: whistleBlow.group.value,
    reportedTo: whistleBlow.reportedTo.value,
    title: whistleBlow.title,
    dateOfIncident: new Date(
      moment(whistleBlow.dateOfIncident, "DD/MM/YYYY")
        .toString()
        .split("GMT")[0]
    ),
    description: whistleBlow.description,
    placeOfIncident: whistleBlow.placeOfIncident,
    involvedPersonnel: whistleBlow.involvedPersonnel.map(
      (personal) => personal.value
    ),
    sharedWith: whistleBlow.sharedWith.map(
      (sharedPersonal) => sharedPersonal.value
    ),
    opinion: whistleBlow.opinion,
    identity: whistleBlow.identity,
    signatureStatus: whistleBlow.signatureStatus,
    updatedBy: getCurrentSessionData().user._id,
  });
}

export function getCqcWhistleBlows({ query }) {
  return http.get(`${apiEndPoint}/whistleblows/?${query}`);
}

export function getCqcWhistleBlow(whistleBlowId) {
  return http.get(`${apiEndPoint}/whistleblows/${whistleBlowId}`);
}

export function deleteCqcWhistleBlow(whistleBlowId) {
  return http.delete(`${apiEndPoint}/whistleblows/${whistleBlowId}`);
}

export function getCqcWhistleBlowCSV() {
  return http.get(`${apiEndPoint}/spreadsheets/whistleblows`);
}

export function sendReport(report) {
  return http.post(`${apiEndPoint}/reports`, {
    group: report.group.value,
    personName: report.personName,
    email: report.email.toLowerCase(),
    message: report.message,
    attachments: report.attachments,
    createdBy: getCurrentSessionData().user._id,
  });
}
export function resendReport(reportId) {
  return http.put(`${apiEndPoint}/reports/${reportId}`);
}
export function getReports({ query }) {
  return http.get(`${apiEndPoint}/reports/?${query}`);
}
export function getReport(reportId) {
  return http.get(`${apiEndPoint}/reports/${reportId}`);
}
export function deleteReport(reportId) {
  return http.delete(`${apiEndPoint}/reports/${reportId}`);
}
export function createSafeguarding(data) {
  return http.post(`${apiEndPoint}/safeguardings`, {
    group: data.group.value,
    personAffected: data.personAffected,
    riskRegistar: data.riskRegistar.value,
    summaryOfConcerns: data.summaryOfConcerns,
    agenciesInvolved: data.agenciesInvolved,
    investigation: data.investigation,
    outcome: data.outcome,
    attachments: data.attachments,
    sharedWith: data.sharedWith.map((user) => user.value),
    createdBy: getCurrentSessionData().user._id,
  });
}

export function updateSafeguarding(id, data) {
  return http.put(`${apiEndPoint}/safeguardings/${id}`, {
    group: data.group.value,
    personAffected: data.personAffected,
    riskRegistar: data.riskRegistar.value,
    summaryOfConcerns: data.summaryOfConcerns,
    agenciesInvolved: data.agenciesInvolved,
    referredStatus: data.referredStatus,
    referredTo: data.referredTo,
    referredEmail: data.referredEmail,
    nameOfOrganisation: data.nameOfOrganisation,
    rational: data.rational,
    attachments: data.attachments,
    sharedWith: data.sharedWith.map((user) => user.value),
    investigation: data.investigation,
    outcome: data.outcome,
    signatureStatus: data.signatureStatus,
    sendReferral: data.sendReferral,
    updatedBy: getCurrentSessionData().user._id,
  });
}

export function getSafeguardings({ query }) {
  return http.get(`${apiEndPoint}/safeguardings/?${query}`);
}

export function getSafeguarding(id) {
  return http.get(`${apiEndPoint}/safeguardings/${id}`);
}

export function deleteSafeguarding(id) {
  return http.delete(`${apiEndPoint}/safeguardings/${id}`);
}
export function deleteSafeguardingAttachnment(id, attachment_id) {
  return http.delete(
    `${apiEndPoint}/safeguardings/${id}/attachments/${attachment_id}`
  );
}

export function getSafeguardingsCSV() {
  return http.get(`${apiEndPoint}/spreadsheets/safeguardings`);
}

export function mapToSafeguardingModel(data) {
  return {
    data: {
      group: {
        label: data.group?.name,
        value: data.group?._id,
      },
      personAffected: data.personAffected,
      riskRegistar: {
        value: data.riskRegistar,
        label: data.riskRegistar,
      },
      summaryOfConcerns: data.summaryOfConcerns,
      agenciesInvolved: data.agenciesInvolved,
      referredStatus: data.referred.status,
      referredTo: data.referred.to,
      referredEmail: data.referred.email,
      nameOfOrganisation: data.referred.nameOfOrganisation,
      rational: data.referred.rational,
      attachments: [],
      sharedWith: data.sharedWith
        .filter((user) => user._id)
        .map((user) => ({ value: user._id, label: user.name })),
      investigation: data.investigation,
      outcome: data.outcome,
      signatureStatus: data.signed.status,
      sendReferral: false,
    },
    errors: {},
  };
}
export function mapToSignificantEventActionModel(action) {
  return {
    data: {
      action: action.value,
      assignedTo: {
        value: action?.assigned?.to?._id,
        label: action?.assigned?.to?.name,
      },
    },
    errors: {},
  };
}
export function mapToControlModel(data) {
  return {
    data: {
      clause: data.control.clause,
      adopted: {
        value: data.adopted,
        label: data.adopted,
      },
    },
    errors: {},
  };
}
export function mapToRatingModel(data) {
  return {
    data: {
      safe: {
        value: data.safe.rating,
        label: data.safe.rating,
      },
      effective: {
        value: data.effective.rating,
        label: data.effective.rating,
      },
      caring: {
        value: data.caring.rating,
        label: data.caring.rating,
      },
      responsive: {
        value: data.responsive.rating,
        label: data.responsive.rating,
      },
      wellLed: {
        value: data.wellLed.rating,
        label: data.wellLed.rating,
      },
      overall: {
        value: data.overall.rating,
        label: data.overall.rating,
      },
    },
    errors: {},
  };
}
export function mapToComplaintModel(compliant) {
  return {
    data: {
      group: {
        value: compliant.group?._id,
        label: compliant.group?.name,
      },
      name: compliant.name,
      address: compliant.address,
      telephone: compliant.telephone,
      email: compliant.email,
      preferredCommunicationMethod: compliant.preferredCommunicationMethod,
      dateAndTimeOfIncident: moment(compliant.dateAndTimeOfIncident).format(
        "DD/MM/YYYY"
      ),
      nameOfEmployee: compliant.nameOfEmployee,
      typeOfService: compliant.typeOfService,
      detail: compliant.detail,
      investigator: compliant.investigator
        ? {
            value: compliant?.investigator?._id,
            label: compliant?.investigator?.name,
          }
        : {
            value: null,
            label: "Select investigator",
          },
      investigation: compliant.investigation,
      actions: compliant.actions,
      outcome: compliant.outcome,
      referredToSomeoneElse: compliant.referredToSomeoneElse,
      referredInvestigator: compliant.referredInvestigator
        ? {
            value: compliant?.referredInvestigator?._id,
            label: compliant?.referredInvestigator?.name,
          }
        : {
            value: null,
            label: "Select referred investigator",
          },
      referredActions: compliant.referredActions,
      referredOutcome: compliant.referredOutcome,
      nameOfOrganisation: compliant.nameOfOrganisation,
      signatureStatus: compliant.signed.status,
      attachments: [],
    },
    errors: {},
  };
}

export function mapToWhistleBlowModel(whistleBlow) {
  return {
    data: {
      group: {
        value: whistleBlow?.group?._id,
        label: whistleBlow?.group?.name,
      },
      reportedTo: {
        value: whistleBlow?.reportedTo?._id,
        label: whistleBlow?.reportedTo?.name,
      },
      title: whistleBlow.title,
      dateOfIncident: moment(whistleBlow.dateOfIncident).format("DD/MM/YYYY"),
      description: whistleBlow.description,
      placeOfIncident: whistleBlow.placeOfIncident,
      involvedPersonnel: whistleBlow.involvedPersonnel
        .filter((personal) => personal)
        .map((personal) => ({ value: personal._id, label: personal.name })),
      sharedWith: whistleBlow.sharedWith
        .filter((person) => person)
        .map((person) => ({ value: person._id, label: person.name })),
      opinion: whistleBlow.opinion,
      identity: whistleBlow.identity,
      signatureStatus: whistleBlow.signed.status,
    },
    errors: {},
  };
}

export function mapToSignificantEventModel(event) {
  return {
    data: {
      group: {
        value: event?.group?._id,
        label: event?.group?.name,
      },
      dateOfEvent: moment(event.dateOfEvent).format("DD/MM/YYYY"),
      title: event.title,
      description: event.description,
      dateOfReviewMeeting: moment(event.dateOfReviewMeeting).format(
        "DD/MM/YYYY"
      ),
      presentPersonnel: event.presentPersonnel,
      positivePoints: event.positivePoints,
      keyIssues: event.keyIssues,
      signatureStatus: event.signed.status,
      attachments: [],
      areasOfConcern: event.areasOfConcern,
    },
    errors: {},
  };
}

export function mapToToolOverview(data) {
  return {
    safe: data.safe,
    caring: data.caring,
    responsive: data.responsive,
    wellLed: data.wellLed,
    effective: data.effective,
    complaints: data.complaints,
    significantEvents: data.significantEvents,
    safeGuardings: data.safeGuardings,
    whistleBlows: data.whistleBlows,
    complaintsOpenVsSignOff: {
      data: {
        labels: ["Open", "Closed"],
        datasets: [
          {
            label: "Complaints",
            pointRadius: 0,
            pointHoverRadius: 0,
            backgroundColor: ["#00c09d", "#e2e2e2"],
            borderWidth: 0,
            data: [data.complaints.open, data.complaints.signedOff],
          },
        ],
      },
      options: {
        cutoutPercentage: 70,
        legend: {
          display: false,
        },

        tooltips: {
          backgroundColor: "#f5f5f5",
          titleFontColor: "#333",
          bodyFontColor: "#666",
          bodySpacing: 4,
          xPadding: 12,
          mode: "nearest",
          intersect: 0,
          position: "nearest",
        },

        scales: {
          yAxes: [
            {
              display: 0,
              ticks: {
                display: false,
              },
              gridLines: {
                drawBorder: false,
                zeroLineColor: "transparent",
                color: "rgba(255,255,255,0.05)",
              },
            },
          ],
          xAxes: [
            {
              display: 0,
              barPercentage: 1.6,
              gridLines: {
                drawBorder: false,
                color: "rgba(255,255,255,0.1)",
                zeroLineColor: "transparent",
              },
              ticks: {
                display: false,
              },
            },
          ],
        },
      },
    },
    SignificantEventsOpenVsSignOff: {
      data: {
        labels: ["Open", "Closed"],
        datasets: [
          {
            label: "Significant Event",
            pointRadius: 0,
            pointHoverRadius: 0,
            backgroundColor: ["#FA26A0", "#e2e2e2"],
            borderWidth: 0,
            data: [
              data.significantEvents.open,
              data.significantEvents.signedOff,
            ],
          },
        ],
      },
      options: {
        cutoutPercentage: 70,
        legend: {
          display: false,
        },

        tooltips: {
          backgroundColor: "#f5f5f5",
          titleFontColor: "#333",
          bodyFontColor: "#666",
          bodySpacing: 4,
          xPadding: 12,
          mode: "nearest",
          intersect: 0,
          position: "nearest",
        },

        scales: {
          yAxes: [
            {
              display: 0,
              ticks: {
                display: false,
              },
              gridLines: {
                drawBorder: false,
                zeroLineColor: "transparent",
                color: "rgba(255,255,255,0.05)",
              },
            },
          ],

          xAxes: [
            {
              display: 0,
              barPercentage: 1.6,
              gridLines: {
                drawBorder: false,
                color: "rgba(255,255,255,0.1)",
                zeroLineColor: "transparent",
              },
              ticks: {
                display: false,
              },
            },
          ],
        },
      },
    },
    SafeGuardingsVsSignOff: {
      data: {
        labels: ["Open", "Closed"],
        datasets: [
          {
            label: "SafeGuardings",
            pointRadius: 0,
            pointHoverRadius: 0,
            backgroundColor: ["#04ECF0", "#e2e2e2"],
            borderWidth: 0,
            data: [data.safeGuardings.open, data.safeGuardings.signedOff],
          },
        ],
      },
      options: {
        cutoutPercentage: 70,
        legend: {
          display: false,
        },

        tooltips: {
          backgroundColor: "#f5f5f5",
          titleFontColor: "#333",
          bodyFontColor: "#666",
          bodySpacing: 4,
          xPadding: 12,
          mode: "nearest",
          intersect: 0,
          position: "nearest",
        },

        scales: {
          yAxes: [
            {
              display: 0,
              ticks: {
                display: false,
              },
              gridLines: {
                drawBorder: false,
                zeroLineColor: "transparent",
                color: "rgba(255,255,255,0.05)",
              },
            },
          ],

          xAxes: [
            {
              display: 0,
              barPercentage: 1.6,
              gridLines: {
                drawBorder: false,
                color: "rgba(255,255,255,0.1)",
                zeroLineColor: "transparent",
              },
              ticks: {
                display: false,
              },
            },
          ],
        },
      },
    },
    whistleBlowsVsSignOff: {
      data: {
        labels: ["Open", "Closed"],
        datasets: [
          {
            label: "Whistleblowing",
            pointRadius: 0,
            pointHoverRadius: 0,
            backgroundColor: ["#E9A200", "#e2e2e2"],
            borderWidth: 0,
            data: [data.whistleBlows.open, data.whistleBlows.signedOff],
          },
        ],
      },
      options: {
        cutoutPercentage: 70,
        legend: {
          display: false,
        },

        tooltips: {
          backgroundColor: "#f5f5f5",
          titleFontColor: "#333",
          bodyFontColor: "#666",
          bodySpacing: 4,
          xPadding: 12,
          mode: "nearest",
          intersect: 0,
          position: "nearest",
        },

        scales: {
          yAxes: [
            {
              display: 0,
              ticks: {
                display: false,
              },
              gridLines: {
                drawBorder: false,
                zeroLineColor: "transparent",
                color: "rgba(255,255,255,0.05)",
              },
            },
          ],

          xAxes: [
            {
              display: 0,
              barPercentage: 1.6,
              gridLines: {
                drawBorder: false,
                color: "rgba(255,255,255,0.1)",
                zeroLineColor: "transparent",
              },
              ticks: {
                display: false,
              },
            },
          ],
        },
      },
    },
  };
}
