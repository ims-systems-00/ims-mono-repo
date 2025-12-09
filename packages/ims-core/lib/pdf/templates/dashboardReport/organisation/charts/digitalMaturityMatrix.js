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
  4: "rgba(0,242,195,0.2)",
  3: "rgba(51,88,244,0.2)",
  2: "rgba(255,141,114,0.2)",
  1: "rgba(253,93,147,0.2)",
};
let digitalMaturityMatrix = (data) => {
  const configuration = {
    type: "bar",
    data: {
      labels: Object.values(data.digitalMaturityMatrix).map(
        (area) => `${area.label}`
      ),
      datasets: [
        {
          label: "Digital maturity matrix",
          data: Object.values(data.digitalMaturityMatrix).map(
            (area) => area.point
          ),
          fill: true,
          borderColor: "rgba(186,84,245,1)",
          backgroundColor: "rgba(186,84,245,0.2)",
        },
      ],
    },
    options: {
      plugins: chartOptions.plugins,
    },
  };
  return canvasRenderService.renderToBuffer(configuration);
};
module.exports = { digitalMaturityMatrix };
