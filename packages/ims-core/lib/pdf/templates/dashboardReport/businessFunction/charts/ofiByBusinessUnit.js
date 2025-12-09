const { ChartJSNodeCanvas } = require("chartjs-node-canvas");
const { chartOptions } = require("../../../../common/chartOptions");
const width = 600;
const height = 300;
const backgroundColour = "white";
const chartColors = {
  open: "#00f2c3",
  implemented: "#1d8cf8",
};
const canvasRenderService = new ChartJSNodeCanvas({
  width,
  height,
  backgroundColour,
});
let ofisByStatus = (data) => {
  let statuses = Object.keys(data.improvementsByStatus);
  let datasets = statuses.map((status) => ({
    label: status.charAt(0).toUpperCase() + status.slice(1),
    data: data.improvementsByStatus[status].improvements,
    borderColor: chartColors[status],
  }));
  const configuration = {
    type: "line",
    data: {
      labels: data.improvementsByStatus.open.months,
      datasets,
    },
    options: {
      plugins: chartOptions.plugins,
    },
  };
  return canvasRenderService.renderToBuffer(configuration);
};

module.exports = { ofisByStatus };
