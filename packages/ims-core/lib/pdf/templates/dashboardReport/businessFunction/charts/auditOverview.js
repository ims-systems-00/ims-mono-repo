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
const backGroundColors = ["#e14eca", "#f4f5f7", "#00f2c3"];
let auditIndentifications = (data) => {
  const configuration = {
    type: "doughnut",
    data: {
      labels: data.audits.findings.areas.map(
        (area, index) => `${area} ${data.audits.findings.data[index]}`
      ),
      datasets: [
        {
          label: "Audit schedules",
          data: data.audits.findings.data,
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
module.exports = { auditIndentifications };
