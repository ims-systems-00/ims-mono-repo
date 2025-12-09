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
  hardware: "#00f2c3",
  software: "#1d8cf8",
  people: "#ff8d72",
  premises: "#5603ad",
  organizational: "#ffd600",
  clinical: "#e14eca",
};
let riskLast12Months = (data) => {
  let catagories = Object.keys(data.riskOverTheYear);
  let datasets = catagories.map((catagory) => ({
    label: catagory.charAt(0).toUpperCase() + catagory.slice(1),
    data: data.riskOverTheYear[catagory].risks,
    borderColor: chartColors[catagory],
  }));
  const configuration = {
    type: "line",
    data: {
      labels: data.riskOverTheYear.hardware.months,
      datasets,
    },
    options: {
      plugins: chartOptions.plugins,
    },
  };
  return canvasRenderService.renderToBuffer(configuration);
};
module.exports = { riskLast12Months };
