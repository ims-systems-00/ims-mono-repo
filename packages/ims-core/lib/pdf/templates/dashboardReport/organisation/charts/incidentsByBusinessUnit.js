const { ChartJSNodeCanvas } = require("chartjs-node-canvas");
const { chartOptions } = require("../../../../common/chartOptions");
const width = 600;
const height = 300;
const backgroundColour = "white";
const canvasRenderService = new ChartJSNodeCanvas({
  width,
  height,
  backgroundColour,
});
let incidentsByBusinessUnit = (data) => {
  const configuration = {
    type: "bar",
    data: {
      labels: data.businessFunctionsWithMostIncidents.businessFunctionNames.map(
        (name) => `${name.substring(0, 6)}...`
      ),
      datasets: [
        {
          label: "Resolved",
          data: data.businessFunctionsWithMostIncidents.resolved,
          borderColor: "rgba(51,88,244,0.7)",
          backgroundColor: "rgba(51,88,244,0.7)",
        },
        {
          label: "Raised",
          data: data.businessFunctionsWithMostIncidents.total,
          borderColor: "rgba(255,141,114,0.7)",
          backgroundColor: "rgba(255,141,114,0.7)",
        },
      ],
    },
    options: {
      plugins: chartOptions.plugins,
    },
  };
  return canvasRenderService.renderToBuffer(configuration);
};
module.exports = { incidentsByBusinessUnit };
