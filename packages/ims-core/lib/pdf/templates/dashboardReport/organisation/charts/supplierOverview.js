const { ChartJSNodeCanvas } = require("chartjs-node-canvas");
const { chartOptions } = require("../../../../common/chartOptions");
const { dashBoard } = require("./data");
const width = 300;
const height = 300;
const backgroundColour = "white";
const canvasRenderService = new ChartJSNodeCanvas({
  width,
  height,
  backgroundColour,
});
const backGroundColors = [
  "#e14eca",
  "#00f2c3",
  "#1d8cf8",
  "#ff8d72",
  "#fd5d93",
  "#adb5bd",
  "#f4f5f7",
  "#212529",
  "#344675",
];
let supplierCompliance = (data) => {
  const configuration = {
    type: "doughnut",
    data: {
      labels: ["Non compliant", "Compliant"],
      datasets: [
        {
          label: "Number of suppliers",
          data: [
            data.supplierCompliance.inCompliant,
            data.supplierCompliance.compliant,
          ],
          backgroundColor: backGroundColors,
        },
      ],
    },
    options: {
      plugins: chartOptions.plugins,
    },
  };
  return canvasRenderService.renderToBuffer(configuration);
};
let supplierIncidents = (data) => {
  const configuration = {
    type: "doughnut",
    data: {
      labels: ["Open incidents", "Resolved incidents"],
      datasets: [
        {
          label: "Number of incidents",
          data: [data.supplierIncidents.open, data.supplierIncidents.resolved],
          backgroundColor: backGroundColors,
        },
      ],
    },
    options: {
      plugins: chartOptions.plugins,
    },
  };
  return canvasRenderService.renderToBuffer(configuration);
};
module.exports = { supplierCompliance, supplierIncidents };
