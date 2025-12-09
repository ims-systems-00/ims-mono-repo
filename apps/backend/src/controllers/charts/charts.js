const { Chart } = require("../../services/charts");
const { StatusCodes } = require("http-status-codes");
const { Filters, formatListResponse } = require("../../services/utility");

exports.createChart = async (req, res, next) => {
  let chartService = new Chart(req.accessControl);
  try {
    const chart = await chartService.createChart({
      ...req.body,
    });
    return res.status(StatusCodes.OK).json({
      message: "Chart created.",
      chart,
    });
  } catch (error) {
    next(error);
  }
};
exports.listCharts = async (req, res, next) => {
  let chartService = new Chart(req.accessControl);
  try {
    let { page, sort, size } = req.query;
    const options = { page, limit: size, sort };
    let filter = new Filters(req, {
      searchFields: ["name", "description"],
    })
      .build()
      .query();
    let query = { ...filter };
    const results = await chartService.listCharts(query, options);
    return res.status(StatusCodes.OK).json({
      message: "Charts retrived.",
      pagination: formatListResponse(results).pagination,
      imsProjects: formatListResponse(results).data,
    });
  } catch (error) {
    next(error);
  }
};
exports.getChart = async (req, res, next) => {
  let chartService = new Chart(req.accessControl);
  try {
    const { id } = req.params;
    const chart = await chartService.getChart({
      _id: id,
    });
    res.status(StatusCodes.OK).json({
      message: "Chart retrived.",
      chart,
    });
  } catch (error) {
    next(error);
  }
};
exports.updateChart = async (req, res, next) => {
  let chartService = new Chart(req.accessControl);
  try {
    const { id } = req.params;
    const chart = await chartService.updateChart(id, {
      ...req.body,
    });
    res.status(StatusCodes.OK).json({
      message: "Chart updated.",
      chart,
    });
  } catch (error) {
    next(error);
  }
};
exports.hardRemoveChart = async (req, res, next) => {
  let chartService = new Chart(req.accessControl);
  try {
    const chart = await chartService.hardRemoveChart(req.params.id);
    return res.status(StatusCodes.OK).json({
      message: "Chart removed.",
      chart,
    });
  } catch (error) {
    next(error);
  }
};
