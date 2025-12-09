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
let ofiRaisedByBusinessUnit = (data) => {
  const configuration = {
    type: "bar",
    data: {
      labels:
        data.businessFunctionsWithMostOpportunities.businessFunctionNames.map(
          (name) => `${name.substring(0, 6)}...`
        ),
      datasets: [
        {
          label: "Number of OFIs",
          data: data.businessFunctionsWithMostOpportunities.amount,
          borderColor: "#1d8cf8",
          backgroundColor: "#1d8cf8",
        },
      ],
    },
    options: {
      plugins: chartOptions.plugins,
    },
  };
  return canvasRenderService.renderToBuffer(configuration);
};
let ofiImplementedByBusinessUnit = (data) => {
  const configuration = {
    type: "bar",
    data: {
      labels:
        data.businessFunctionsWithMostImprovements.businessFunctionNames.map(
          (name) => `${name.substring(0, 6)}...`
        ),
      datasets: [
        {
          label: "Number of implemented OFIs",
          data: data.businessFunctionsWithMostImprovements.amount,
          borderColor: "#1d8cf8",
          backgroundColor: "#1d8cf8",
        },
      ],
    },
    options: {
      plugins: chartOptions.plugins,
    },
  };
  return canvasRenderService.renderToBuffer(configuration);
};
module.exports = { ofiRaisedByBusinessUnit, ofiImplementedByBusinessUnit };
