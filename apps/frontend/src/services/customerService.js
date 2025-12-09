import http from "./httpServices";
import moment from "moment";
import { getCurrentSessionData } from "./authService";
import { backFillMonths } from "./utils/analytics";
const apiEndPoint = `/api/${process.env.REACT_APP_API_VERSION}/customers`;

export function getCustomerOverview(customerId) {
  return http.get(`${apiEndPoint}/${customerId}/overviews`);
}
export function getCustomers({ query }) {
  return http.get(`${apiEndPoint}/?${query}`);
}
export function getCustomer(dataId) {
  return http.get(`${apiEndPoint}/${dataId}`);
}

export function getMyCustomerOverview() {
  return http.get(
    `${apiEndPoint}/analytics/manageroverview/${
      getCurrentSessionData().user._id
    }`
  );
}
export function createCustomer(data) {
  return http.post(`${apiEndPoint}/`, {
    group: data.group.value,
    status: data.status.value,
    stage: data.stage.value,
    name: data.name,
    town: data.town,
    buildingName: data.buildingName,
    streetName: data.streetName,
    postCode: data.postCode,
    accountManager: data.accountManager.value,
    accountNumber: data.accountNumber,
    primaryEmail: data.primaryEmail,
    secondaryEmail: data.secondaryEmail,
    primaryContact: data.primaryContact,
    secondaryContact: data.secondaryContact,
    contractValue: data.contractValue,
    serviceProvision: data.serviceProvision,
    attachments: data.attachments,
    probability: data.probability.value,
    notes: data.notes,
    source: data.source,
    phoneNumber: data.phoneNumber,
    tagsAndCategories: data.tagsAndCategories.value,
    companyNumber: data.companyNumber,
    reasonForLoss: data.reasonForLoss,
    contractStartDate: new Date(
      moment(data.contractStartDate, "DD/MM/YYYY").toString().split("GMT")[0]
    ),
    contractEndDate: new Date(
      moment(data.contractEndDate, "DD/MM/YYYY").toString().split("GMT")[0]
    ),
    reviewDate: new Date(
      moment(data.reviewDate, "DD/MM/YYYY").toString().split("GMT")[0]
    ),
    logo: data.logoInfo[0],
    createdBy: getCurrentSessionData().user._id,
  });
}
export function updateCustomer(dataId, data) {
  return http.put(`${apiEndPoint}/${dataId}`, {
    group: data.group.value,
    name: data.name,
    status: data.status.value,
    stage: data.stage.value,
    accountManager: data.accountManager.value,
    accountNumber: data.accountNumber,
    primaryEmail: data.primaryEmail,
    secondaryEmail: data.secondaryEmail,
    primaryContact: data.primaryContact,
    secondaryContact: data.secondaryContact,
    town: data.town,
    buildingName: data.buildingName,
    streetName: data.streetName,
    postCode: data.postCode,
    serviceProvision: data.serviceProvision,
    contractValue: data.contractValue,
    attachments: data.attachments,
    probability: data.probability.value,
    reasonForLoss: data.reasonForLoss,
    notes: data.notes,
    source: data.source,
    phoneNumber: data.phoneNumber,
    companyNumber: data.companyNumber,
    tagsAndCategories: data.tagsAndCategories.value,
    contractStartDate: new Date(
      moment(data.contractStartDate, "DD/MM/YYYY").toString().split("GMT")[0]
    ),
    contractEndDate: new Date(
      moment(data.contractEndDate, "DD/MM/YYYY").toString().split("GMT")[0]
    ),
    reviewDate: new Date(
      moment(data.reviewDate, "DD/MM/YYYY").toString().split("GMT")[0]
    ),
    logo: data.logoInfo[0],
  });
}
export function deleteCustomer(dataId) {
  http.delete(`${apiEndPoint}/${dataId}`);
}

export function mapToMyCustomerOverview(data) {
  let chart_1_2_3_options = {
    maintainAspectRatio: false,
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
    responsive: true,
    scales: {
      yAxes: [
        {
          barPercentage: 1.6,
          gridLines: {
            drawBorder: false,
            color: "rgba(29,140,248,0.0)",
            zeroLineColor: "transparent",
          },
          ticks: {
            suggestedMin: 0,
            suggestedMax: 10,
            padding: 10,
            fontColor: "#9a9a9a",
          },
        },
      ],
      xAxes: [
        {
          barPercentage: 1.6,
          gridLines: {
            drawBorder: false,
            color: "rgba(29,140,248,0.1)",
            zeroLineColor: "transparent",
          },
          ticks: {
            padding: 20,
            fontColor: "#9a9a9a",
          },
        },
      ],
    },
  };
  return {
    crmCustomers: {
      data: (canvas) => {
        let ctx = canvas.getContext("2d");

        let gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);

        gradientStroke.addColorStop(1, "rgba(72,72,176,0.1)");
        gradientStroke.addColorStop(0.4, "rgba(218, 63, 63, 0.856)");
        gradientStroke.addColorStop(0, "rgba(225, 238, 39, 0.856)");

        return {
          labels: data.customerAnalysis.map((analysis) => analysis._id.stage),
          datasets: [
            {
              label: "Number of customers",
              fill: true,
              backgroundColor: gradientStroke,
              hoverBackgroundColor: gradientStroke,
              borderColor: "#fd5d93",
              borderWidth: 2,
              borderDash: [],
              borderDashOffset: 0.0,
              data: data.customerAnalysis.map((analysis) => analysis.count),
            },
          ],
        };
      },
      options: {
        maintainAspectRatio: false,
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
        responsive: true,
        scales: {
          yAxes: [
            {
              gridLines: {
                drawBorder: false,
                color: "rgba(225,78,202,0.1)",
                zeroLineColor: "transparent",
              },
              ticks: {
                suggestedMin: 0,
                suggestedMax: 10,
                padding: 20,
                fontColor: "#9e9e9e",
              },
            },
          ],
          xAxes: [
            {
              gridLines: {
                drawBorder: false,
                color: "rgba(225,78,202,0.1)",
                zeroLineColor: "transparent",
              },
              ticks: {
                padding: 20,
                fontColor: "#9e9e9e",
              },
            },
          ],
        },
      },
    },
    campaignPerMonth: {
      data: (canvas) => {
        let ctx = canvas.getContext("2d");

        let gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);

        gradientStroke.addColorStop(1, "rgba(29,140,248,0.2)");
        gradientStroke.addColorStop(0.4, "rgba(29,140,248,0.0)");
        gradientStroke.addColorStop(0, "rgba(29,140,248,0)"); //blue colors

        return {
          labels: backFillMonths(data.monthlyCampaign).map(
            (campaign) => campaign._id
          ),
          datasets: [
            {
              label: "Number",
              fill: true,
              backgroundColor: gradientStroke,
              borderColor: "#1f8ef1",
              borderWidth: 2,
              borderDash: [],
              borderDashOffset: 0.0,
              pointBackgroundColor: "#1f8ef1",
              pointBorderColor: "rgba(255,255,255,0)",
              pointHoverBackgroundColor: "#1f8ef1",
              pointBorderWidth: 20,
              pointHoverRadius: 4,
              pointHoverBorderWidth: 15,
              pointRadius: 4,
              data: backFillMonths(data.monthlyCampaign).map(
                (campaign) => campaign.count
              ),
            },
          ],
        };
      },
      options: chart_1_2_3_options,
    },
    crmContractValue: {
      data: (canvas) => {
        let ctx = canvas.getContext("2d");

        let gradientStroke = ctx.createLinearGradient(30, 0, 70, 0);

        gradientStroke.addColorStop(1, "rgba(33, 102, 167, 0.459)");
        gradientStroke.addColorStop(0.4, "rgba(72,72,176,0.0)");
        gradientStroke.addColorStop(0, "rgba(119,52,169,0)"); //purple colors

        return {
          labels: data.customerAnalysis.map((analysis) => analysis._id.stage),
          datasets: [
            {
              label: "Amount(£)",
              fill: true,
              backgroundColor: gradientStroke,
              hoverBackgroundColor: gradientStroke,
              borderColor: gradientStroke,
              borderWidth: 2,
              borderDash: [],
              borderDashOffset: 0.0,
              data: data.customerAnalysis.map(
                (analysis) => analysis.contractValue
              ),
            },
          ],
        };
      },
      options: {
        maintainAspectRatio: false,
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
        responsive: true,
        scales: {
          yAxes: [
            {
              gridLines: {
                drawBorder: false,
                color: "rgba(225,78,202,0.1)",
                zeroLineColor: "transparent",
              },
              ticks: {
                suggestedMin: 50,
                suggestedMax: 200,
                padding: 20,
                fontColor: "#9e9e9e",
              },
            },
          ],
          xAxes: [
            {
              gridLines: {
                drawBorder: false,
                color: "rgba(225,78,202,0.1)",
                zeroLineColor: "transparent",
              },
              ticks: {
                suggestedMin: 50,
                suggestedMax: 200,
                padding: 20,
                fontColor: "#9e9e9e",
              },
            },
          ],
        },
      },
    },
    crmInvoicesCount: {
      data: (canvas) => {
        let ctx = canvas.getContext("2d");

        let gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);

        gradientStroke.addColorStop(1, "rgba(33, 102, 167, 0.459)");
        gradientStroke.addColorStop(0.4, "rgba(72,72,176,0.0)");
        gradientStroke.addColorStop(0, "rgba(119,52,169,0)"); //purple colors

        return {
          labels: data.invoiceAnalysis.map((analysis) => analysis._id.status),
          datasets: [
            {
              label: "Number of invoices",
              fill: true,
              backgroundColor: gradientStroke,
              hoverBackgroundColor: gradientStroke,
              borderColor: "#0098f0",
              borderWidth: 2,
              borderDash: [],
              borderDashOffset: 0.0,
              data: data.invoiceAnalysis.map((analysis) => analysis.count),
            },
          ],
        };
      },
      options: {
        maintainAspectRatio: false,
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
        responsive: true,
        scales: {
          yAxes: [
            {
              gridLines: {
                drawBorder: false,
                color: "rgba(225,78,202,0.1)",
                zeroLineColor: "transparent",
              },
              ticks: {
                suggestedMin: 0,
                suggestedMax: 10,
                padding: 20,
                fontColor: "#9e9e9e",
              },
            },
          ],
          xAxes: [
            {
              gridLines: {
                drawBorder: false,
                color: "rgba(225,78,202,0.1)",
                zeroLineColor: "transparent",
              },
              ticks: {
                padding: 20,
                fontColor: "#9e9e9e",
              },
            },
          ],
        },
      },
    },
    crmInvoicesAmount: {
      data: (canvas) => {
        let ctx = canvas.getContext("2d");
        let gradientStroke = ctx.createLinearGradient(30, 0, 70, 0);

        gradientStroke.addColorStop(1, "rgba(238, 75, 203, 0.651)");
        gradientStroke.addColorStop(0.4, "rgba(238, 75, 203, 0)");
        gradientStroke.addColorStop(0, "rgba(238, 75, 203, 0)"); //purple colors

        return {
          labels: data.invoiceAnalysis.map((analysis) => analysis._id.status),
          datasets: [
            {
              label: "Amount(£)",
              fill: true,
              backgroundColor: gradientStroke,
              hoverBackgroundColor: gradientStroke,
              borderColor: gradientStroke,
              borderWidth: 2,
              borderDash: [],
              borderDashOffset: 0,
              data: data.invoiceAnalysis.map(
                (analysis) => analysis.calculations
              ),
            },
          ],
        };
      },
      options: {
        maintainAspectRatio: false,
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
        responsive: true,
        scales: {
          yAxes: [
            {
              gridLines: {
                drawBorder: false,
                color: "rgba(225,78,202,0.1)",
                zeroLineColor: "transparent",
              },
              ticks: {
                suggestedMin: 50,
                suggestedMax: 200,
                padding: 20,
                fontColor: "#9e9e9e",
              },
            },
          ],
          xAxes: [
            {
              gridLines: {
                drawBorder: false,
                color: "rgba(225,78,202,0.1)",
                zeroLineColor: "transparent",
              },
              ticks: {
                suggestedMin: 50,
                suggestedMax: 200,
                padding: 20,
                fontColor: "#9e9e9e",
              },
            },
          ],
        },
      },
    },
  };
}
export function mapToCustomerModel(data) {
  return {
    data: {
      group: {
        value: data.group?._id,
        label: data.group?.name,
      },
      status: {
        value: data.status,
        label: data.status,
      },
      stage: {
        value: data.stage,
        label: data.stage,
      },
      probability: {
        value: data.probability,
        label: `${data.probability}%`,
      },
      name: data.name,
      accountManager: data.accountManager
        ? {
            value: data.accountManager?._id,
            label: data.accountManager?.name,
          }
        : {
            value: null,
            label: "Select account manager",
          },
      tagsAndCategories: {
        value: data.tagsAndCategories?._id,
        label: data.tagsAndCategories?.name,
      },
      town: data.town,
      buildingName: data.buildingName,
      streetName: data.streetName,
      postCode: data.postCode,
      accountNumber: data.accountNumber,
      primaryEmail: data.primaryEmail,
      secondaryEmail: data.secondaryEmail,
      serviceProvision: data.serviceProvision,
      primaryContact: data.primaryContact,
      secondaryContact: data.secondaryContact,
      contractValue: data.contractValue,
      attachments: [],
      reasonForLoss: data.reasonForLoss,
      notes: data.notes,
      source: data.source,
      contractValue: data.contractValue,
      phoneNumber: data.phoneNumber,
      companyNumber: data.companyNumber,
      contractStartDate: data.contractStartDate
        ? moment(data.contractStartDate).format("D/M/Y")
        : "",
      contractEndDate: data.contractEndDate
        ? moment(data.contractEndDate).format("D/M/Y")
        : "",
      reviewDate: data.reviewDate
        ? moment(data.reviewDate).format("D/M/Y")
        : "",
      logoInfo:
        data.logo && data.logo.storageInfo ? [data.logo.storageInfo] : [],
    },
    errors: {},
  };
}
export function deleteAttachmnet(dataId, attachmentId) {
  return http.delete(`${apiEndPoint}/${dataId}/attachments/${attachmentId}`);
}

export function mapToCustomerOverview(data) {
  return {
    invoiceStatuses: {
      data: {
        labels: data.totalInvoiceAmount.map((total) => total._id.status),
        datasets: [
          {
            label: "Status",
            pointRadius: 0,
            pointHoverRadius: 0,
            backgroundColor: ["#ff8d72", "#00c09d", "#e2e2e2"],
            borderWidth: 0,
            data: data.totalInvoiceAmount.map(
              (totalAmount) => totalAmount.count
            ),
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
    paidVsDue: {
      data: {
        labels: data.totalInvoiceAmount.map((group) => group._id.status),
        datasets: [
          {
            label: "Status",
            pointRadius: 0,
            pointHoverRadius: 0,
            backgroundColor: ["#0098f0", "#e2e2e2", "#FF6D39"],
            borderWidth: 0,
            data: data.totalInvoiceAmount.map((group) =>
              parseFloat(group.calculations).toFixed(2)
            ),
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
    openVsResolved: {
      data: {
        labels: data.totalIncidents.map((incident) =>
          incident._id.status ? ["Resolved"] : ["Open"]
        ),
        datasets: [
          {
            label: "Status",
            pointRadius: 0,
            pointHoverRadius: 0,
            backgroundColor: ["#FA26A0", "#e2e2e2", "#FF6D39"],
            borderWidth: 0,
            data: data.totalIncidents.map((incident) => incident.count),
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
