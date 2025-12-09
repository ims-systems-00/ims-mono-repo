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
let riskByBusinessUnit = (data) => {
  const configuration = {
    type: "bar",
    data: {
      labels:
        data.businessFunctionsHavingMostRisks.businessFunctionNames.map(
          (name) => `${name.substring(0, 6)}...`
        ),
      datasets: [
        {
          label: "Number of Risks",
          data: data.businessFunctionsHavingMostRisks.risks,
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
module.exports = { riskByBusinessUnit };
