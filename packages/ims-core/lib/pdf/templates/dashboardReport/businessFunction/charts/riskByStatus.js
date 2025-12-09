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
const chartColors = {
  open: "#00f2c3",
  closed: "#1d8cf8",
  accepted: "#ff8d72",
  escalated: "#5603ad",
};
let riskByStatus = (data) => {
  let statuses = Object.keys(data.risksByStatus);
  let datasets = statuses.map((status) => ({
    label: status.charAt(0).toUpperCase() + status.slice(1),
    data: data.risksByStatus[status].risks,
    borderColor: chartColors[status],
  }));
  const configuration = {
    type: "line",
    data: {
      labels: data.risksByStatus.open.months,
      datasets,
    },
    options: {
      plugins: chartOptions.plugins,
    },
  };
  return canvasRenderService.renderToBuffer(configuration);
};
module.exports = { riskByStatus };
