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
const backGroundColors = [
  "#e14eca",
  "#f4f5f7",
  "#00f2c3",
  "#1d8cf8",
  "#ff8d72",
  "#fd5d93",
  "#adb5bd",
  "#212529",
  "#344675",
];
let nonConformitiesByBusinessUnit = (data) => {
  const configuration = {
    type: "doughnut",
    data: {
      labels: data.nonConformities.businessFunctionNames,
      datasets: [
        {
          label: "Number of non conformities",
          data: data.nonConformities.amount,
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
module.exports = { nonConformitiesByBusinessUnit };
