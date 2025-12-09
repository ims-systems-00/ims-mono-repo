import moment from "moment";
import { getCurrentSessionData } from "./authService";
import http from "./httpServices";
import { backFillMonths } from "./utils/analytics";
moment().format();

const apiEndPoint = `/api/${process.env.REACT_APP_API_VERSION}/dashboards`;

export function getAllDashboards({ query }) {
  return http.get(`${apiEndPoint}/groups/?${query}`);
}
export function loadDashboardData() {
  return http.get(`${apiEndPoint}/organisation/`);
}
export function loadBusinessDashboardData(id) {
  return http.get(`${apiEndPoint}/groups/${id}`);
}
export function extractDashboardReport(data) {
  return http.post(`${apiEndPoint}/organisation`, {
    email: data.email,
    name: data.name,
    message: data.message,
    user: getCurrentSessionData().user,
  });
}
export function extractBusinessFunctionDashboardReport(id, data) {
  return http.post(`${apiEndPoint}/groups/${id}`, {
    email: data.email,
    name: data.name,
    message: data.message,
    user: getCurrentSessionData().user,
  });
}
export function mapToDigitalMaturityModel(data) {
  return {
    name: data.groupName,
    digitalMaturityStatus: Object.values(data.digitalMaturityMatrix),
    digitalMaturity: {
      data: Object.values(data.digitalMaturityMatrix),
      options: {
        dataKey: "label",
        angles: [
          { key: "point", label: "Points", color: "#c6e0fb" },
          // { key: 'percentage', label: 'Percentage', color: '#82ca9d' }
        ],
        width: 530,
        height: 250,
        domain: [1, 5],
        borderColor: "#1D8BF8",
      },
    },
  };
}
export function mapToDashBoardSAModel(data) {
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
    updatedAt: data.updatedAt,
    businessFunctions: data.businessFunctions,
    complianceFunctions: data.complianceFunctions,
    numberOfStaffs: data.numberOfStaffs,
    staffRemote: data.staffRemote,
    premises: data.premises,
    organizationalState: data.organizationalState,
    organizationalConfidence: data.organizationalConfidence,
    criticalArea: data.criticalArea,
    incidents: data.incidents,
    audits: data.audits,
    overallStatus: data.cqc.compliance.overall,
    totalContractValue: data.supplier.contractValue.total,
    interactions: data.crm.interactions,
    lastManagementReviewDate:
      moment(data.lastManagementReviewDate).format("D/M/YYYY") ===
      "Invalid date"
        ? "No schedule"
        : moment(data.lastManagementReviewDate).format("D/M/YYYY"),
    nextManagementReviewDate:
      moment(data.nextManagementReviewDate).format("D/M/YYYY") ===
      "Invalid date"
        ? "No schedule"
        : moment(data.nextManagementReviewDate).format("D/M/YYYY"),
    suppliers: data.supplierCompliance,
    supplierIncidents: data.supplierIncidents,
    compliance: data.compliance,
    nonConformities: data.nonConformities,
    mostValuedCustomer: data.crm.mostValuedLiveCustomer,
    lessValuedCustomer: data.crm.lessValuedLiveCustomer,
    averageContractValue: data.crm.averageContractValue,
    totalLiveContractValue: data.crm.totalLiveContractValue,
    activeCampaign: data.crm.activeCampaign,
    closedCampaign: data.crm.closedCampaign,
    digitalMaturityScore: Object.values(data.digitalMaturityMatrix),
    digitalMaturity: {
      data: Object.values(data.digitalMaturityMatrix),
      options: {
        dataKey: "label",
        angles: [
          { key: "point", label: "Points", color: "#c6e0fb" },
          // { key: 'percentage', label: 'Percentage', color: '#82ca9d' }
        ],
        width: 530,
        height: 250,
        domain: [1, 5],
        borderColor: "#1D8BF8",
      },
    },
    riskOverTheYear: {
      data1: (canvas) => {
        let ctx = canvas.getContext("2d");

        let gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);

        gradientStroke.addColorStop(1, "rgba(29,140,248,0.2)");
        gradientStroke.addColorStop(0.4, "rgba(29,140,248,0.0)");
        gradientStroke.addColorStop(0, "rgba(29,140,248,0)"); //blue colors

        return {
          labels: data.riskOverTheYear.hardware.months,
          datasets: [
            {
              label: "Total risks",
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
              data: data.riskOverTheYear.hardware.risks,
            },
          ],
        };
      },
      data2: (canvas) => {
        let ctx = canvas.getContext("2d");

        let gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);

        gradientStroke.addColorStop(1, "rgba(29,140,248,0.2)");
        gradientStroke.addColorStop(0.4, "rgba(29,140,248,0.0)");
        gradientStroke.addColorStop(0, "rgba(29,140,248,0)"); //blue colors

        return {
          labels: data.riskOverTheYear.software.months,
          datasets: [
            {
              label: "Total risks",
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
              data: data.riskOverTheYear.software.risks,
            },
          ],
        };
      },
      data3: (canvas) => {
        let ctx = canvas.getContext("2d");

        let gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);

        gradientStroke.addColorStop(1, "rgba(29,140,248,0.2)");
        gradientStroke.addColorStop(0.4, "rgba(29,140,248,0.0)");
        gradientStroke.addColorStop(0, "rgba(29,140,248,0)"); //blue colors

        return {
          labels: data.riskOverTheYear.people.months,
          datasets: [
            {
              label: "Total risks",
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
              data: data.riskOverTheYear.people.risks,
            },
          ],
        };
      },
      data4: (canvas) => {
        let ctx = canvas.getContext("2d");

        let gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);

        gradientStroke.addColorStop(1, "rgba(29,140,248,0.2)");
        gradientStroke.addColorStop(0.4, "rgba(29,140,248,0.0)");
        gradientStroke.addColorStop(0, "rgba(29,140,248,0)"); //blue colors

        return {
          labels: data.riskOverTheYear.premises.months,
          datasets: [
            {
              label: "Total risks",
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
              data: data.riskOverTheYear.premises.risks,
            },
          ],
        };
      },
      data5: (canvas) => {
        let ctx = canvas.getContext("2d");

        let gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);

        gradientStroke.addColorStop(1, "rgba(29,140,248,0.2)");
        gradientStroke.addColorStop(0.4, "rgba(29,140,248,0.0)");
        gradientStroke.addColorStop(0, "rgba(29,140,248,0)"); //blue colors

        return {
          labels: data.riskOverTheYear.organizational.months,
          datasets: [
            {
              label: "Total risks",
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
              data: data.riskOverTheYear.organizational.risks,
            },
          ],
        };
      },
      data6: (canvas) => {
        let ctx = canvas.getContext("2d");

        let gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);

        gradientStroke.addColorStop(1, "rgba(29,140,248,0.2)");
        gradientStroke.addColorStop(0.4, "rgba(29,140,248,0.0)");
        gradientStroke.addColorStop(0, "rgba(29,140,248,0)"); //blue colors

        return {
          labels: data.riskOverTheYear.clinical.months,
          datasets: [
            {
              label: "Total risks",
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
              data: data.riskOverTheYear.clinical.risks,
            },
          ],
        };
      },
      options: chart_1_2_3_options,
    },
    risksByStatus: {
      data: (data?.risksByStatus?.open?.months || []).map((month, j) => ({
        Month: month,
        Open: data?.risksByStatus?.open?.risks[j] || 0,
        Accepted: data?.risksByStatus?.accepted?.risks[j] || 0,
        Escalated: data?.risksByStatus?.escalated?.risks[j] || 0,
        Mitigated: data?.risksByStatus?.mitigated?.risks[j] || 0,
      })),
      options: {
        xKey: "Month",
        lineDataKeys: ["Open", "Accepted", "Escalated", "Mitigated"],
        lineColors: ["#ff8d72", "#1d8cf8", "#fd5d93", "#00f2c3"],
        width: 550,
        height: 200,
      },
    },
    closedRisk: {
      data: (data?.businessFunctionsHavingMostRisks.businessFunctionNames).map(
        (name, i) => ({
          Name: name?.substring(0, 3),
          Risks: data.businessFunctionsHavingMostRisks.risks[i],
        })
      ),
      options: {
        xKey: "Name",
        lineDataKeys: ["Risks"],
        lineColors: ["#439EED"],
        width: 550,
        height: 200,
      },
    },
    finance: {
      data: (data?.finance.areas).map((area, i) => ({
        Areas: area,
        Costs: data.finance.costs[i],
      })),
      options: {
        xKey: "Areas",
        barKeys: ["Costs"],
        colors: ["#439EED"],
        width: 570,
        height: 250,
      },
    },
    inventory: {
      data: (data?.inventory.areas).map((area, i) => ({
        Areas: area,
        Amount: data.inventory.amounts[i] || 0,
      })),
      options: {
        xKey: "Areas",
        barKeys: ["Amount"],
        colors: ["#439EED"],
        width: 570,
        height: 250,
      },
    },
    opportunities: {
      data: (
        data?.businessFunctionsWithMostOpportunities.businessFunctionNames || []
      ).map((name, i) => ({
        Name: name?.substring(0, 3) || "",
        Amount: data.businessFunctionsWithMostOpportunities.amount[i] || 0, // Default to 0 if amounts are undefined
      })),
      options: {
        xKey: "Name",
        barKeys: ["Amount"],
        colors: ["#17A2B8"],
        width: 600,
        height: 350,
      },
    },
    improvements: {
      data: (
        data?.businessFunctionsWithMostImprovements.businessFunctionNames || []
      ).map((name, i) => ({
        Name: name?.substring(0, 3) || "",
        Amount: data.businessFunctionsWithMostImprovements.amount[i] || 0, // Default to 0 if amounts are undefined
      })),
      options: {
        xKey: "Name",
        barKeys: ["Amount"],
        colors: ["#17A2B8"],
        width: 600,
        height: 350,
      },
    },
    nonConformitiesVsConformities: {
      data: (data?.nonConformities.businessFunctionNames).map((Name, i) => ({
        name: Name,
        Amount: data.nonConformities.amount[i],
      })),
      options: {
        dataKey: "Amount",
        colors: ["#17A2B8", "#FFC107", "#439EED", "#82ca9d", "#ffc658"],
        padding: 3,
        innerRadius: `50%`,
        outerRadius: `90%`,
        width: 280,
        height: 280,
      },
    },
    sheduledAuditVsCompletedAudit: {
      data: [
        { name: "Completed", value: data.audits.completed },
        { name: "Incompleted", value: data.audits.inCompleted },
      ],
      options: {
        colors: ["#439EED", "#FFC107"],
        chartSize: 220,
        gradient: true,
        color: "gradient",
        progress: (
          (data.audits.completed /
            (data.audits.completed + data.audits.inCompleted)) *
          100
        ).toFixed(0),
      },
    },
    businessFunctionsWithMostIncidents: {
      data: (data?.businessFunctionsWithMostIncidents.businessFunctionNames).map(
        (name, i) => ({
          fullName: name,
          name: name?.substring(0, 3) || "",
          Total: data.businessFunctionsWithMostIncidents.total[i] || 0,
          Resolved: data.businessFunctionsWithMostIncidents.resolved[i] || 0,
        })
      ),
      options: {
        xKey: "name",
        barKeys: ["Total", "Resolved"],
        colors: ["#439EED", "#FFC107"],
        width: 1280,
        height: 400,
      },
    },
    incidentsTotal: {
      data: {
        labels: ["Total", "Resolved"],
        datasets: [
          {
            label: "Incidents",
            pointRadius: 0,
            pointHoverRadius: 0,
            backgroundColor: ["#00c09d", "#e2e2e2"],
            borderWidth: 0,
            data: [data.incidents.total, data.incidents.resolved],
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
    suppliersVsCompliant: {
      data: [
        { name: "Compliant", value: data.supplierCompliance.compliant },
        {
          name: "Non-compliant",
          value: data.supplierCompliance.inCompliant || 0,
        },
      ],
      options: {
        dataKey: "value",
        colors: ["#439EED", "#FFC107"],
        padding: 2,
        innerRadius: `50%`,
        outerRadius: `90%`,
        width: 280,
        height: 280,
      },
    },
    supplierIncidentVsResolvedIncident: {
      data: [
        { name: "Open", value: data.supplierIncidents.open },
        { name: "Resolved", value: data.supplierIncidents.resolved },
      ],
      options: {
        dataKey: "value",
        colors: ["#439EED", "#CED4DA"],
        padding: 4,
        innerRadius: `70%`,
        outerRadius: `90%`,
        width: 280,
        height: 240,
      },
    },
    compliance: {
      iso14001: {
        data: [
          { name: "Compliant", value: data?.compliance?.iso14001 },
          { name: "Non-compliant", value: 100 - data?.compliance?.iso14001 },
        ],
        options: {
          colors: ["#439EED", "#FFFFFF"],
          chartSize: 150,
          gradient: false,
          color: "#439EED",
          progress: data.compliance?.iso14001
            ? data.compliance?.iso14001.toFixed(0)
            : 0,
        },
      },
      iso15686_5: {
        data: [
          { name: "Compliant", value: data?.compliance?.iso15686_5 },
          { name: "Non-compliant", value: 100 - data?.compliance?.iso15686_5 },
        ],
        options: {
          colors: ["#439EED", "#FFFFFF"],
          chartSize: 150,
          gradient: false,
          color: "#439EED",
          progress: data.compliance?.iso15686_5
            ? data.compliance?.iso15686_5.toFixed(0)
            : 0,
        },
      },
      iso20000: {
        data: [
          { name: "Compliant", value: data?.compliance?.iso20000 },
          { name: "Non-compliant", value: 100 - data?.compliance?.iso20000 },
        ],
        options: {
          colors: ["#439EED", "#FFFFFF"],
          chartSize: 150,
          gradient: false,
          color: "#439EED",
          progress: data.compliance?.iso20000
            ? data.compliance?.iso20000.toFixed(0)
            : 0,
        },
      },
      iso27001: {
        data: [
          { name: "Compliant", value: data?.compliance?.iso27001 },
          { name: "Non-compliant", value: 100 - data?.compliance.iso27001 },
        ],
        options: {
          colors: ["#439EED", "#FFFFFF"],
          chartSize: 150,
          gradient: false,
          color: "#439EED",
          progress: data.compliance?.iso27001
            ? data.compliance?.iso27001.toFixed(0)
            : 0,
        },
      },
      iso27001_2022: {
        data: [
          { name: "Compliant", value: data?.compliance?.iso27001_2022 },
          {
            name: "Non-compliant",
            value: 100 - data?.compliance.iso27001_2022,
          },
        ],
        options: {
          colors: ["#439EED", "#FFFFFF"],
          chartSize: 150,
          gradient: false,
          color: "#439EED",
          progress: data.compliance?.iso27001_2022
            ? data.compliance?.iso27001_2022.toFixed(0)
            : 0,
        },
      },
      iso27001_2022_annex_a: {
        data: [
          { name: "Compliant", value: data?.compliance?.iso27001_2022_annex_a },
          {
            name: "Non-compliant",
            value: 100 - data?.compliance.iso27001_2022_annex_a,
          },
        ],
        options: {
          colors: ["#439EED", "#FFFFFF"],
          chartSize: 150,
          gradient: false,
          color: "#439EED",
          progress: data.compliance?.iso27001_2022_annex_a
            ? data.compliance?.iso27001_2022_annex_a.toFixed(0)
            : 0,
        },
      },
      iso27002: {
        data: [
          { name: "Compliant", value: data?.compliance?.iso27002 },
          { name: "Non-compliant", value: 100 - data?.compliance?.iso27002 },
        ],
        options: {
          colors: ["#439EED", "#FFFFFF"],
          chartSize: 150,
          gradient: false,
          color: "#439EED",
          progress: data?.compliance?.iso27002
            ? data?.compliance?.iso27002.toFixed(0)
            : 0,
        },
      },
      iso9001: {
        data: [
          { name: "Compliant", value: data?.compliance?.iso9001 },
          { name: "Non-compliant", value: 100 - data?.compliance.iso9001 },
        ],
        options: {
          colors: ["#439EED", "#FFFFFF"],
          chartSize: 150,
          gradient: false,
          color: "#439EED",
          progress: data?.compliance?.iso9001
            ? data?.compliance?.iso9001.toFixed(0)
            : 0,
        },
      },
      iso45001: {
        data: [
          { name: "Compliant", value: data?.compliance?.iso45001 },
          { name: "Non-compliant", value: 100 - data?.compliance?.iso45001 },
        ],
        options: {
          colors: ["#439EED", "#FFFFFF"],
          chartSize: 150,
          gradient: false,
          color: "#439EED",
          progress: data?.compliance?.iso45001
            ? data?.compliance?.iso45001.toFixed(0)
            : 0,
        },
      },
      dsptNhs: {
        data: [
          { name: "Compliant", value: data?.compliance?.dsptNhs },
          { name: "Non-compliant", value: 100 - data?.compliance?.dsptNhs },
        ],
        options: {
          colors: ["#439EED", "#FFFFFF"],
          chartSize: 150,
          gradient: false,
          color: "#439EED",
          progress: data?.compliance?.dsptNhs
            ? data?.compliance?.dsptNhs.toFixed(0)
            : 0,
        },
      },
      bs9997: {
        data: [
          { name: "Compliant", value: data?.compliance?.bs9997 },
          { name: "Non-compliant", value: 100 - data?.compliance?.bs9997 },
        ],
        options: {
          colors: ["#439EED", "#FFFFFF"],
          chartSize: 150,
          gradient: false,
          color: "#439EED",
          progress: data?.compliance?.bs9997
            ? data?.compliance?.bs9997.toFixed(0)
            : 0,
        },
      },
    },
    CQCFunctionWithMostComplaints: {
      data: {
        labels: data.cqc.complaints.businessFunctionNames.map((name) =>
          name.shortName.substring(0, 3)
        ),
        datasets: [
          {
            label: "Open",
            fill: true,
            backgroundColor: "#00c09d",
            hoverBackgroundColor: "#00c09d",
            borderColor: "#00c09d",
            borderWidth: 2,
            borderDash: [],
            borderDashOffset: 0.0,
            data: data.cqc.complaints.total,
          },
          {
            label: "Closed",
            fill: true,
            backgroundColor: "#e2e2e2",
            hoverBackgroundColor: "#e2e2e2",
            borderColor: "#e2e2e2",
            borderWidth: 2,
            borderDash: [],
            borderDashOffset: 0.0,
            data: data.cqc.complaints.signedOff,
          },
        ],
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
                color: "rgba(29,140,248,0.1)",
                zeroLineColor: "transparent",
              },
              ticks: {
                suggestedMin: 0,
                suggestedMax: 10,
                padding: 20,
                fontColor: "#9e9e9e",
                beginAtZero: true,
              },
            },
          ],
          xAxes: [
            {
              gridLines: {
                drawBorder: false,
                color: "rgba(29,140,248,0.1)",
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
    CQCFunctionWithMostSignificantEvents: {
      data: {
        labels: data.cqc.significantEvents.businessFunctionNames.map((name) =>
          name.shortName.substring(0, 3)
        ),
        datasets: [
          {
            label: "Open",
            fill: true,
            backgroundColor: "#FA26A0",
            hoverBackgroundColor: "#FA26A0",
            borderColor: "#FA26A0",
            borderWidth: 2,
            borderDash: [],
            borderDashOffset: 0.0,
            data: data.cqc.significantEvents.total,
          },
          {
            label: "Closed",
            fill: true,
            backgroundColor: "#e2e2e2",
            hoverBackgroundColor: "#e2e2e2",
            borderColor: "#e2e2e2",
            borderWidth: 2,
            borderDash: [],
            borderDashOffset: 0.0,
            data: data.cqc.significantEvents.signedOff,
          },
        ],
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
                color: "rgba(29,140,248,0.1)",
                zeroLineColor: "transparent",
              },
              ticks: {
                suggestedMin: 0,
                suggestedMax: 10,
                padding: 20,
                fontColor: "#9e9e9e",
                beginAtZero: true,
              },
            },
          ],
          xAxes: [
            {
              gridLines: {
                drawBorder: false,
                color: "rgba(29,140,248,0.1)",
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
    CQCFunctionWithMostSafeguarding: {
      data: {
        labels: data.cqc.safeGuardings.businessFunctionNames.map((name) =>
          name.shortName.substring(0, 3)
        ),
        datasets: [
          {
            label: "Open",
            fill: true,
            backgroundColor: "#04ECF0",
            hoverBackgroundColor: "#04ECF0",
            borderColor: "#04ECF0",
            borderWidth: 2,
            borderDash: [],
            borderDashOffset: 0.0,
            data: data.cqc.safeGuardings.total,
          },
          {
            label: "Closed",
            fill: true,
            backgroundColor: "#e2e2e2",
            hoverBackgroundColor: "#e2e2e2",
            borderColor: "#e2e2e2",
            borderWidth: 2,
            borderDash: [],
            borderDashOffset: 0.0,
            data: data.cqc.safeGuardings.signedOff,
          },
        ],
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
                color: "rgba(29,140,248,0.1)",
                zeroLineColor: "transparent",
              },
              ticks: {
                suggestedMin: 0,
                suggestedMax: 10,
                padding: 20,
                fontColor: "#9e9e9e",
                beginAtZero: true,
              },
            },
          ],
          xAxes: [
            {
              gridLines: {
                drawBorder: false,
                color: "rgba(29,140,248,0.1)",
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
    CQCFunctionWithMostWhistleBlow: {
      data: {
        labels: data.cqc.whistleBlows.businessFunctionNames.map((name) =>
          name.shortName.substring(0, 3)
        ),
        datasets: [
          {
            label: "Open",
            fill: true,
            backgroundColor: "#E9A200",
            hoverBackgroundColor: "#E9A200",
            borderColor: "#E9A200",
            borderWidth: 2,
            borderDash: [],
            borderDashOffset: 0.0,
            data: data.cqc.whistleBlows.total,
          },
          {
            label: "Closed",
            fill: true,
            backgroundColor: "#e2e2e2",
            hoverBackgroundColor: "#e2e2e2",
            borderColor: "#e2e2e2",
            borderWidth: 2,
            borderDash: [],
            borderDashOffset: 0.0,
            data: data.cqc.whistleBlows.signedOff,
          },
        ],
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
                color: "rgba(29,140,248,0.1)",
                zeroLineColor: "transparent",
              },
              ticks: {
                suggestedMin: 0,
                suggestedMax: 10,
                padding: 20,
                fontColor: "#9e9e9e",
                beginAtZero: true,
              },
            },
          ],
          xAxes: [
            {
              gridLines: {
                drawBorder: false,
                color: "rgba(29,140,248,0.1)",
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
    crmCustomers: {
      data: (data?.crm.customers.stages).map((stage, i) => ({
        Stages: stage,
        Counts: data.crm.customers.counts[i],
      })),
      options: {
        xKey: "Stages",
        barKeys: ["Counts"],
        colors: ["#D63384"],
        width: 580,
        height: 280,
      },
    },
    crmContractValue: {
      data: (data?.crm.contractValue.stages || []).map((stage, i) => ({
        Stages: stage,
        Amounts: data.crm.contractValue.amounts[i] || 0, // Default to 0 if amounts are undefined
      })),
      options: {
        xKey: "Stages",
        barKeys: ["Amounts"],
        colors: ["#D63384"],
        width: 580,
        height: 280,
      },
    },
    crmInvoicesCount: {
      data: (data?.crm.invoiceThisMonth.status).map((Status, i) => ({
        Status,
        Counts: data.crm.invoiceThisMonth.counts[i] || 0,
      })),
      options: {
        xKey: "Status",
        barKeys: ["Counts"],
        colors: ["#17A2B8"],
        width: 580,
        height: 200,
      },
    },
    crmInvoicesAmount: {
      data: (data?.crm.invoiceAmountThisMonth.status || []).map(
        (Status, i) => ({
          Status,
          Amounts: data.crm.invoiceAmountThisMonth.amounts[i] || 0, // Default to 0 if amounts are undefined
        })
      ),
      options: {
        xKey: "Status",
        barKeys: ["Amounts"],
        colors: ["#17A2B8"],
        width: 580,
        height: 200,
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
          labels: backFillMonths(data.crm.monthlyCampaign).map(
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
              data: backFillMonths(data.crm.monthlyCampaign).map(
                (campaign) => campaign.count
              ),
            },
          ],
        };
      },
      options: chart_1_2_3_options,
    },
    interactionsLastYear: {
      data: (data?.crm?.interactions?.last12Month).map((interaction) => ({
        Month: interaction?._id,
        Counts: interaction?.count,
      })),
      options: {
        xKey: "Month",
        lineDataKeys: ["Counts"],
        lineColors: ["#439EED"],
        width: 1280,
        height: 400,
      },
    },
  };
}
export function mapToBusinessDashBoardHOSModel(data) {
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
            suggestedMax: 20,
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
    updatedAt: data.updatedAt,
    businessFunctions: data.groupName,
    numberOfStaffs: data.numberOfStaffs,
    staffRemote: data.staffRemote,
    premises: data.premises,
    organizationalState: data.organizationalState,
    organizationalConfidence: data.organizationalConfidence,
    criticalArea: data.criticalArea,
    incidents: data.incidents,
    risksOverview: data.risksOverview,
    audits: data.audits,
    totalContractValue: data.supplier.contractValue.total,
    interactions: data.crm.interactions,
    lastManagementReviewDate:
      moment(data.lastManagementReviewDate).format("D/M/YYYY") ===
      "Invalid date"
        ? "No schedule"
        : moment(data.lastManagementReviewDate).format("D/M/YYYY"),
    nextManagementReviewDate:
      moment(data.nextManagementReviewDate).format("D/M/YYYY") ===
      "Invalid date"
        ? "No schedule"
        : moment(data.nextManagementReviewDate).format("D/M/YYYY"),
    suppliers: data.supplierCompliance,
    supplierIncidents: data.supplierIncidents,
    compliance: data.compliance,
    nonConformities: data.nonConformities,
    mostValuedCustomer: data.crm.mostValuedLiveCustomer,
    lessValuedCustomer: data.crm.lessValuedLiveCustomer,
    averageContractValue: data.crm.averageContractValue,
    totalLiveContractValue: data.crm.totalLiveContractValue,
    activeCampaign: data.crm.activeCampaign,
    closedCampaign: data.crm.closedCampaign,
    digitalMaturityScore: Object.values(data.digitalMaturityMatrix),
    digitalMaturity: {
      data: Object.values(data.digitalMaturityMatrix),
      options: {
        dataKey: "label",
        angles: [
          { key: "point", label: "Points", color: "#c6e0fb" },
          // { key: 'percentage', label: 'Percentage', color: '#82ca9d' }
        ],
        width: 530,
        height: 250,
        domain: [1, 5],
        borderColor: "#1D8BF8",
      },
    },

    riskOverTheYear: {
      data1: (canvas) => {
        let ctx = canvas.getContext("2d");

        let gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);

        gradientStroke.addColorStop(1, "rgba(29,140,248,0.2)");
        gradientStroke.addColorStop(0.4, "rgba(29,140,248,0.0)");
        gradientStroke.addColorStop(0, "rgba(29,140,248,0)"); //blue colors

        return {
          labels: data.riskOverTheYear.hardware.months,
          datasets: [
            {
              label: "Total risks",
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
              data: data.riskOverTheYear.hardware.risks,
            },
          ],
        };
      },
      data2: (canvas) => {
        let ctx = canvas.getContext("2d");

        let gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);

        gradientStroke.addColorStop(1, "rgba(29,140,248,0.2)");
        gradientStroke.addColorStop(0.4, "rgba(29,140,248,0.0)");
        gradientStroke.addColorStop(0, "rgba(29,140,248,0)"); //blue colors

        return {
          labels: data.riskOverTheYear.software.months,
          datasets: [
            {
              label: "Total risks",
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
              data: data.riskOverTheYear.software.risks,
            },
          ],
        };
      },
      data3: (canvas) => {
        let ctx = canvas.getContext("2d");

        let gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);

        gradientStroke.addColorStop(1, "rgba(29,140,248,0.2)");
        gradientStroke.addColorStop(0.4, "rgba(29,140,248,0.0)");
        gradientStroke.addColorStop(0, "rgba(29,140,248,0)"); //blue colors

        return {
          labels: data.riskOverTheYear.people.months,
          datasets: [
            {
              label: "Total risks",
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
              data: data.riskOverTheYear.people.risks,
            },
          ],
        };
      },
      data4: (canvas) => {
        let ctx = canvas.getContext("2d");

        let gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);

        gradientStroke.addColorStop(1, "rgba(29,140,248,0.2)");
        gradientStroke.addColorStop(0.4, "rgba(29,140,248,0.0)");
        gradientStroke.addColorStop(0, "rgba(29,140,248,0)"); //blue colors

        return {
          labels: data.riskOverTheYear.premises.months,
          datasets: [
            {
              label: "Total risks",
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
              data: data.riskOverTheYear.premises.risks,
            },
          ],
        };
      },
      data5: (canvas) => {
        let ctx = canvas.getContext("2d");

        let gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);

        gradientStroke.addColorStop(1, "rgba(29,140,248,0.2)");
        gradientStroke.addColorStop(0.4, "rgba(29,140,248,0.0)");
        gradientStroke.addColorStop(0, "rgba(29,140,248,0)"); //blue colors

        return {
          labels: data.riskOverTheYear.organizational.months,
          datasets: [
            {
              label: "Total risks",
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
              data: data.riskOverTheYear.organizational.risks,
            },
          ],
        };
      },
      data6: (canvas) => {
        let ctx = canvas.getContext("2d");

        let gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);

        gradientStroke.addColorStop(1, "rgba(29,140,248,0.2)");
        gradientStroke.addColorStop(0.4, "rgba(29,140,248,0.0)");
        gradientStroke.addColorStop(0, "rgba(29,140,248,0)"); //blue colors

        return {
          labels: data.riskOverTheYear.clinical.months,
          datasets: [
            {
              label: "Total risks",
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
              data: data.riskOverTheYear.clinical.risks,
            },
          ],
        };
      },
      options: chart_1_2_3_options,
    },
    risksByStatus: {
      data: (data?.risksByStatus?.open?.months || []).map((month, j) => ({
        Month: month,
        Open: data?.risksByStatus?.open?.risks[j] || 0,
        Accepted: data?.risksByStatus?.accepted?.risks[j] || 0,
        Escalated: data?.risksByStatus?.escalated?.risks[j] || 0,
        Mitigated: data?.risksByStatus?.mitigated?.risks[j] || 0,
      })),
      options: {
        xKey: "Month",
        lineDataKeys: ["Open", "Accepted", "Escalated", "Mitigated"],
        lineColors: ["#ff8d72", "#1d8cf8", "#fd5d93", "#00f2c3"],
        width: 550,
        height: 200,
      },
    },
    incidentsByStatus: {
      data: (data?.incidentsByStatus?.open?.months).map((month, j) => ({
        Month: month,
        Open: data?.incidentsByStatus?.open?.incidents[j] || 0,
        Resolved: data?.incidentsByStatus?.resolved?.incidents[j] || 0,
        Escalated: data?.incidentsByStatus?.escalated?.incidents[j] || 0,
      })),
      options: {
        xKey: "Month",
        lineDataKeys: ["Open", "Resolved", "Escalated"],
        lineColors: ["#439EED", "#428194", "#fbc6e0"],
        width: 1280,
        height: 380,
      },
    },
    closedRisk: {
      data: (canvas) => {
        let ctx = canvas.getContext("2d");

        let gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);

        gradientStroke.addColorStop(1, "rgba(29,140,248,0.2)");
        gradientStroke.addColorStop(0.4, "rgba(29,140,248,0.0)");
        gradientStroke.addColorStop(0, "rgba(29,140,248,0)"); //blue colors

        return {
          labels:
            data.businessFunctionsHavingMostRisks.businessFunctionNames.map(
              (name) => name.substring(0, 3)
            ),
          datasets: [
            {
              label: "Risks",
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
              data: data.businessFunctionsHavingMostRisks.risks,
            },
          ],
        };
      },
      options: chart_1_2_3_options,
    },
    finance: {
      data: (data?.finance.areas).map((area, i) => ({
        Areas: area,
        Costs: data.finance.costs[i],
      })),
      options: {
        xKey: "Areas",
        barKeys: ["Costs"],
        colors: ["#439EED"],
        width: 570,
        height: 250,
      },
    },
    inventory: {
      data: (data?.inventory.areas).map((area, i) => ({
        Areas: area,
        Amount: data.inventory.amounts[i] || 0,
      })),
      options: {
        xKey: "Areas",
        barKeys: ["Amount"],
        colors: ["#439EED"],
        width: 570,
        height: 250,
      },
    },
    improvementsOpen: {
      data: data.improvementsByStatus.open.months.map((month, i) => ({
        Month: month,
        Amount: data.improvementsByStatus.open.improvements[i],
      })),
      options: {
        xKey: "Month",
        barKeys: ["Amount"],
        colors: ["#17A2B8"],
        width: 600,
        height: 250,
      },
    },
    improvementsImplemented: {
      data: data.improvementsByStatus.implemented.months.map((month, i) => ({
        Month: month,
        Amount: data.improvementsByStatus.implemented.improvements[i],
      })),
      options: {
        xKey: "Month",
        barKeys: ["Amount"],
        colors: ["#17A2B8"],
        width: 600,
        height: 250,
      },
    },
    internalAudits: {
      data: data.audits.findings.areas.map((area, i) => ({
        Area: area,
        Count: data.audits.findings.data[i],
      })),
      options: {
        xKey: "Area",
        barKeys: ["Count"],
        colors: ["#D63384"],
        width: 580,
        height: 320,
      },
    },
    opportunities: {
      data: (canvas) => {
        let ctx = canvas.getContext("2d");

        let gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);

        gradientStroke.addColorStop(1, "rgba(72,72,176,0.1)");
        gradientStroke.addColorStop(0.4, "rgba(72,72,176,0.0)");
        gradientStroke.addColorStop(0, "rgba(119,52,169,0)"); //purple colors

        return {
          labels:
            data.businessFunctionsWithMostOpportunities.businessFunctionNames.map(
              (name) => name.substring(0, 3)
            ),
          datasets: [
            {
              label: "OFIs",
              fill: true,
              backgroundColor: gradientStroke,
              hoverBackgroundColor: gradientStroke,
              borderColor: "#d048b6",
              borderWidth: 2,
              borderDash: [],
              borderDashOffset: 0.0,
              data: data.businessFunctionsWithMostOpportunities.amount,
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
                padding: 2,
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
    sheduledAuditVsCompletedAudit: {
      data: [
        { name: "Completed", value: data.audits.completed },
        { name: "Incompleted", value: data.audits.inCompleted },
      ],
      options: {
        colors: ["#439EED", "#FFC107"],
        chartSize: 220,
        gradient: true,
        color: "gradient",
        progress: (
          (data.audits.completed /
            (data.audits.completed + data.audits.inCompleted)) *
          100
        ).toFixed(0),
      },
    },
    risksTotal: {
      data: {
        labels: ["Total", "Opened", "Mitigated", "Escalated", "Accepted"],
        datasets: [
          {
            label: "Risks",
            pointRadius: 0,
            pointHoverRadius: 0,
            backgroundColor: ["#00c09d", "#e2e2e2"],
            borderWidth: 0,
            data: [
              data.risksOverview.totalRisksInThisSystemDates,
              data.risksOverview.totalOpenedRisksInThisMonth,
              data.risksOverview.totalMitigatedRisksInThisMonth,
              data.risksOverview.totalEscalatedRisksInThisMonth,
              data.risksOverview.totalAcceptedRisksInThisMonth,
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
    suppliersVsCompliant: {
      data: [
        { name: "Compliant", value: data.supplierCompliance.compliant },
        {
          name: "Non-compliant",
          value: data.supplierCompliance.inCompliant || 0,
        },
      ],
      options: {
        dataKey: "value",
        colors: ["#439EED", "#FFC107"],
        padding: 2,
        innerRadius: `50%`,
        outerRadius: `90%`,
        width: 280,
        height: 280,
      },
    },
    supplierIncidentVsResolvedIncident: {
      data: [
        { name: "Open", value: data.supplierIncidents.open },
        { name: "Resolved", value: data.supplierIncidents.resolved },
      ],
      options: {
        dataKey: "value",
        colors: ["#439EED", "#CED4DA"],
        padding: 4,
        innerRadius: `70%`,
        outerRadius: `90%`,
        width: 280,
        height: 240,
      },
    },

    crmCustomers: {
      data: (data?.crm.customers.stages).map((stage, i) => ({
        Stages: stage,
        Counts: data.crm.customers.counts[i],
      })),
      options: {
        xKey: "Stages",
        barKeys: ["Counts"],
        colors: ["#D63384"],
        width: 580,
        height: 280,
      },
    },
    crmContractValue: {
      data: (data?.crm.contractValue.stages || []).map((stage, i) => ({
        Stages: stage,
        Amounts: data.crm.contractValue.amounts[i] || 0, // Default to 0 if amounts are undefined
      })),
      options: {
        xKey: "Stages",
        barKeys: ["Amounts"],
        colors: ["#D63384"],
        width: 580,
        height: 280,
      },
    },
    crmInvoicesCount: {
      data: (data?.crm.invoiceThisMonth.status).map((Status, i) => ({
        Status,
        Counts: data.crm.invoiceThisMonth.counts[i] || 0,
      })),
      options: {
        xKey: "Status",
        barKeys: ["Counts"],
        colors: ["#17A2B8"],
        width: 580,
        height: 200,
      },
    },
    crmInvoicesAmount: {
      data: (data?.crm.invoiceAmountThisMonth.status || []).map(
        (Status, i) => ({
          Status,
          Amounts: data.crm.invoiceAmountThisMonth.amounts[i] || 0, // Default to 0 if amounts are undefined
        })
      ),
      options: {
        xKey: "Status",
        barKeys: ["Amounts"],
        colors: ["#17A2B8"],
        width: 580,
        height: 200,
      },
    },
    compliance: {
      iso14001: {
        data: [
          { name: "Compliant", value: data?.compliance?.iso14001 },
          { name: "Non-compliant", value: 100 - data?.compliance?.iso14001 },
        ],
        options: {
          colors: ["#439EED", "#FFFFFF"],
          chartSize: 150,
          gradient: false,
          color: "#439EED",
          progress: data.compliance?.iso14001
            ? data.compliance?.iso14001.toFixed(0)
            : 0,
        },
      },
      iso15686_5: {
        data: [
          { name: "Compliant", value: data?.compliance?.iso15686_5 },
          { name: "Non-compliant", value: 100 - data?.compliance?.iso15686_5 },
        ],
        options: {
          colors: ["#439EED", "#FFFFFF"],
          chartSize: 150,
          gradient: false,
          color: "#439EED",
          progress: data.compliance?.iso15686_5
            ? data.compliance?.iso15686_5.toFixed(0)
            : 0,
        },
      },
      iso20000: {
        data: [
          { name: "Compliant", value: data?.compliance?.iso20000 },
          { name: "Non-compliant", value: 100 - data?.compliance?.iso20000 },
        ],
        options: {
          colors: ["#439EED", "#FFFFFF"],
          chartSize: 150,
          gradient: false,
          color: "#439EED",
          progress: data.compliance?.iso20000
            ? data.compliance?.iso20000.toFixed(0)
            : 0,
        },
      },
      iso27001: {
        data: [
          { name: "Compliant", value: data?.compliance?.iso27001 },
          { name: "Non-compliant", value: 100 - data?.compliance.iso27001 },
        ],
        options: {
          colors: ["#439EED", "#FFFFFF"],
          chartSize: 150,
          gradient: false,
          color: "#439EED",
          progress: data.compliance?.iso27001
            ? data.compliance?.iso27001.toFixed(0)
            : 0,
        },
      },
      iso27001_2022: {
        data: [
          { name: "Compliant", value: data?.compliance?.iso27001_2022 },
          {
            name: "Non-compliant",
            value: 100 - data?.compliance.iso27001_2022,
          },
        ],
        options: {
          colors: ["#439EED", "#FFFFFF"],
          chartSize: 150,
          gradient: false,
          color: "#439EED",
          progress: data.compliance?.iso27001_2022
            ? data.compliance?.iso27001_2022.toFixed(0)
            : 0,
        },
      },
      iso27001_2022_annex_a: {
        data: [
          { name: "Compliant", value: data?.compliance?.iso27001_2022_annex_a },
          {
            name: "Non-compliant",
            value: 100 - data?.compliance.iso27001_2022_annex_a,
          },
        ],
        options: {
          colors: ["#439EED", "#FFFFFF"],
          chartSize: 150,
          gradient: false,
          color: "#439EED",
          progress: data.compliance?.iso27001_2022_annex_a
            ? data.compliance?.iso27001_2022_annex_a.toFixed(0)
            : 0,
        },
      },
      iso27002: {
        data: [
          { name: "Compliant", value: data?.compliance?.iso27002 },
          { name: "Non-compliant", value: 100 - data?.compliance?.iso27002 },
        ],
        options: {
          colors: ["#439EED", "#FFFFFF"],
          chartSize: 150,
          gradient: false,
          color: "#439EED",
          progress: data?.compliance?.iso27002
            ? data?.compliance?.iso27002.toFixed(0)
            : 0,
        },
      },
      iso9001: {
        data: [
          { name: "Compliant", value: data?.compliance?.iso9001 },
          { name: "Non-compliant", value: 100 - data?.compliance.iso9001 },
        ],
        options: {
          colors: ["#439EED", "#FFFFFF"],
          chartSize: 150,
          gradient: false,
          color: "#439EED",
          progress: data?.compliance?.iso9001
            ? data?.compliance?.iso9001.toFixed(0)
            : 0,
        },
      },
      iso45001: {
        data: [
          { name: "Compliant", value: data?.compliance?.iso45001 },
          { name: "Non-compliant", value: 100 - data?.compliance?.iso45001 },
        ],
        options: {
          colors: ["#439EED", "#FFFFFF"],
          chartSize: 150,
          gradient: false,
          color: "#439EED",
          progress: data?.compliance?.iso45001
            ? data?.compliance?.iso45001.toFixed(0)
            : 0,
        },
      },
      dsptNhs: {
        data: [
          { name: "Compliant", value: data?.compliance?.dsptNhs },
          { name: "Non-compliant", value: 100 - data?.compliance?.dsptNhs },
        ],
        options: {
          colors: ["#439EED", "#FFFFFF"],
          chartSize: 150,
          gradient: false,
          color: "#439EED",
          progress: data?.compliance?.dsptNhs
            ? data?.compliance?.dsptNhs.toFixed(0)
            : 0,
        },
      },
      bs9997: {
        data: [
          { name: "Compliant", value: data?.compliance?.bs9997 },
          { name: "Non-compliant", value: 100 - data?.compliance?.bs9997 },
        ],
        options: {
          colors: ["#439EED", "#FFFFFF"],
          chartSize: 150,
          gradient: false,
          color: "#439EED",
          progress: data?.compliance?.bs9997
            ? data?.compliance?.bs9997.toFixed(0)
            : 0,
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
          labels: backFillMonths(data.crm.monthlyCampaign).map(
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
              data: backFillMonths(data.crm.monthlyCampaign).map(
                (campaign) => campaign.count
              ),
            },
          ],
        };
      },
      options: chart_1_2_3_options,
    },
    interactionsLastYear: {
      data: (data?.crm?.interactions?.last12Month).map((interaction) => ({
        Month: interaction?._id,
        Counts: interaction?.count,
      })),
      options: {
        xKey: "Month",
        lineDataKeys: ["Counts"],
        lineColors: ["#439EED"],
        width: 1280,
        height: 400,
      },
    },
  };
}
