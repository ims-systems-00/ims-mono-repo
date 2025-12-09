import { getCurrentSessionData } from "./authService";
import { uploadFileToS3 } from "./fileHandlerService";
import http from "./httpServices";
import { getCurrentUserInfo } from "./userServices";
const apiEndPoint = `/api/${process.env.REACT_APP_API_VERSION}/compliances`;

export function createCompliance(name) {
  return http.post(`${apiEndPoint}/`, {
    name,
  });
}

export function getCompliance({ query }) {
  return http.get(`${apiEndPoint}/?${query}`);
}
export function getComplianceControl(controlId) {
  return http.get(`${apiEndPoint}/controls/${controlId}`);
}
export function getComplianceOverview(toolName) {
  return http.get(`${apiEndPoint}/overview/${toolName}`);
}

export function deleteCompliance({ query }) {
  return http.delete(`${apiEndPoint}/?${query}`);
}

export function addEvidence(compliance) {
  return http.post(`${apiEndPoint}/evidence`, {
    name: compliance.name,
    clause: compliance.clause,
    evidence: compliance.evidence,
  });
}

export function deleteEvidence({ query }) {
  return http.delete(`${apiEndPoint}/evidence/?${query}`);
}

export function updateComment(compliance) {
  return http.put(`${apiEndPoint}/comments/`, {
    name: compliance.name,
    clause: compliance.clause,
    comment: compliance.comment,
  });
}

export function updateISOControl(id, data) {
  return http.put(`${apiEndPoint}/controls/${id}/status`, data);
}

export function addEvidenceToCompliance(controlId, data) {
  return http.post(`${apiEndPoint}/controls/${controlId}/evidence`, {
    evidences: data.docs,
  });
}

export async function addControlFileEvidence(controlId, evidenceData) {
  const { data } = await uploadFileToS3(evidenceData, evidenceData.name, {});
  console.log("evidenceData.file", data);
  return http.post(`${apiEndPoint}/controls/${controlId}/control-evidence`, {
    evidenceType: "raw-file",
    fileStorage: data.uploadInformation,
  });
}

export function getControlFileEvidences(controlId, { queryString }) {
  return http.get(
    `${apiEndPoint}/controls/${controlId}/control-evidence?${queryString}`
  );
}

export function removeControlEvidence(controlId, evidenceId) {
  return http.delete(
    `${apiEndPoint}/controls/${controlId}/control-evidence/${evidenceId}`
  );
}

export function removeEvidence(controlId, evidenceId) {
  return http.delete(
    `${apiEndPoint}/controls/${controlId}/evidence/${evidenceId}`
  );
}

export function linkEvidence(controlId, data) {
  return http.post(
    `${apiEndPoint}/controls/${controlId}/control-evidence`,
    data
  );
}

export function getlinkEvidence(controlId, { query }) {
  return http.get(
    `${apiEndPoint}/controls/${controlId}/control-evidence/?${query}`
  );
}

export function mapToClauseModel(data) {
  return {
    data: {
      name: data.name,
      clause: data.control.clause,
      title: data.control.title,
      state: {
        value: data.state,
        label: data.state,
      },
      selected: {
        value: data.selected,
        label: data.selected,
      },
    },
    errors: {},
  };
}

export function mapToISOOverview(data) {
  return {
    compliance: data.totalPercentage,
    controlsSelected: data.controlsSelected,
    controlsImplemented: data.controlsImplemented,
    notCompliance: 100 - data.totalPercentage,
    ComplianceVsNotCompliance: {
      data: {
        labels: ["Compliant", "Non-compliant"],
        datasets: [
          {
            label: "Compliance",
            pointRadius: 0,
            pointHoverRadius: 0,
            backgroundColor: ["#ff8d72", "#e2e2e2"],
            borderWidth: 0,
            data: [data.totalPercentage, 100 - data.totalPercentage],
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
    selectedVsImplemented: {
      data: {
        labels: ["Selected", "Implemented"],
        datasets: [
          {
            label: "Compliance",
            pointRadius: 0,
            pointHoverRadius: 0,
            backgroundColor: ["#00c09d", "#e2e2e2"],
            borderWidth: 0,
            data: [data.controlsSelected, data.controlsImplemented],
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
