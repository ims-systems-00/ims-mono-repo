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
let finance = (data) => {
  const configuration = {
    type: "bar",
    data: {
      labels: data.finance.areas,
      datasets: {
        label: "Expenditure",
        data: data.finance.costs,
        borderColor: "ffd600",
      },
    },
    options: {
      plugins: chartOptions.plugins,
    },
  };
  return canvasRenderService.renderToBuffer(configuration);
};
module.exports = { finance };
