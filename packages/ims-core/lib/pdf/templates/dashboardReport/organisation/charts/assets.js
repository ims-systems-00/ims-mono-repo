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
let assets = (data) => {
  const configuration = {
    type: "bar",
    data: {
      labels: data.inventory.areas,
      datasets: [
        {
          label: "Number of Assets",
          data: data.inventory.amounts,
          borderColor: "#11cdef",
          backgroundColor: "#11cdef",
        },
      ],
    },
    options: {
      plugins: chartOptions.plugins,
    },
  };
  return canvasRenderService.renderToBuffer(configuration);
};
module.exports = { assets };
