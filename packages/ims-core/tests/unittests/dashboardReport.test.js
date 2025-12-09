const { expect } = require("chai");
const { build } = require("../../lib/pdf");
const {
  buDashBoard,
} = require("../../lib/pdf/templates/dashboardReport/businessFunction/charts/data");
const {
  dashBoard,
} = require("../../lib/pdf/templates/dashboardReport/organisation/charts/data");

describe("dashboard report unit tests", function () {
  it("should generate a organisational dashboard report if proper dataset is provided", async function () {
    let response = await build({
      fileName: "orgDashboardReport.pdf",
      template: "dashboardReport",
      data: {
        ...dashBoard,
        kpiObjectives: ["kapi / objective render line"],
      },
      metaInfo: {
        sentBy: { name: "Riad Hossain", email: "riad@imssystems.tech" },
        sentTo: { name: "Riad Hossain", email: "riad@imssystems.tech" },
        organisationName: "Fancy organisation",
      },
    });
    expect(response).to.be.equal("Pdf document has been prepared successfuly");
  });
  it("should generate a businessunit dashboard report if proper dataset is provided", async function () {
    let response = await build({
      fileName: "buDashboardReport.pdf",
      template: "buDashboardReport",
      data: {
        ...buDashBoard,
        kpiObjectives: ["kapi / objective render line"],
      },
      metaInfo: {
        sentBy: { name: "Riad Hossain", email: "riad@imssystems.tech" },
        sentTo: { name: "Riad Hossain", email: "riad@imssystems.tech" },
        organisationName: "Fancy organisation",
      },
    });
    expect(response).to.be.equal("Pdf document has been prepared successfuly");
  });
});
