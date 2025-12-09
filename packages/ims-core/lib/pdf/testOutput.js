const { build } = require(".");
const moment = require("moment");
const {
  buDashBoard,
} = require("./templates/dashboardReport/businessFunction/charts/data");

build({
  fileName: "buoutput.pdf",
  template: "buDashboardReport",
  data: {
    ...buDashBoard,
  },
  metaInfo: {
    sentBy: { name: "Riad Hossain", email: "riad@imssystems.tech" },
    sentTo: { name: "Abdullah Al Rafee", email: "rafee@imssystems.tech" },
    sentOn: moment(new Date()).format("DD/MM/YYYY h:m a"),
    organisationName: "Angel organisation",
    reportTitle: "Live dashboard report",
  },
});
