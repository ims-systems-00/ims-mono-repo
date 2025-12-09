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

const backGroundColors = ["#e14eca", "#ff8d72", "#00f2c3", "#1d8cf8"];
let numberOfCustomers = (data) => {
  const configuration = {
    type: "bar",
    data: {
      labels: data.crm.customers.stages,
      datasets: [
        {
          label: "Number of customers",
          data: data.crm.customers.counts,
          backgroundColor: backGroundColors[0],
        },
      ],
    },
    options: {
      plugins: chartOptions.plugins,
    },
  };
  return canvasRenderService.renderToBuffer(configuration);
};
let contractValues = (data) => {
  const configuration = {
    type: "bar",
    data: {
      labels: data.crm.contractValue.stages,
      datasets: [
        {
          label: "Contract values",
          data: data.crm.contractValue.amounts,
          backgroundColor: backGroundColors[1],
        },
      ],
    },
    options: {
      plugins: chartOptions.plugins,
    },
  };
  return canvasRenderService.renderToBuffer(configuration);
};
let numberInvoicesThisMonth = (data) => {
  const configuration = {
    type: "bar",
    data: {
      labels: data.crm.invoiceThisMonth.status,
      datasets: [
        {
          label: "Number of invoices",
          data: data.crm.invoiceThisMonth.amounts,
          backgroundColor: backGroundColors[2],
        },
      ],
    },
    options: {
      plugins: chartOptions.plugins,
    },
  };
  return canvasRenderService.renderToBuffer(configuration);
};
let invoiceValuesThisMonth = (data) => {
  const configuration = {
    type: "bar",
    data: {
      labels: data.crm.invoiceAmountThisMonth.status,
      datasets: [
        {
          label: "Amount invoiced",
          data: data.crm.invoiceAmountThisMonth.amounts,
          backgroundColor: backGroundColors[3],
        },
      ],
    },
    options: {
      plugins: chartOptions.plugins,
    },
  };
  return canvasRenderService.renderToBuffer(configuration);
};
module.exports = {
  contractValues,
  numberOfCustomers,
  numberInvoicesThisMonth,
  invoiceValuesThisMonth,
};
