const { Manager } = require("./manager");
const { APIError } = require("../../helpers/errors/apiError");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const mongoose = require("mongoose");
const { models } = require("../../models");

const population = [];
class Chart extends Manager {
  constructor(connection) {
    super(connection);
  }
  async createChart(data) {
    let exists = await this.Charts.findOne({ name: data.name });
    if (exists)
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "A chart with the same id already exists."
      );
    let { name, pipeline, description } = data;
    let newChart = new this.Charts({
      name,
      description,
      pipeline,
    });
    newChart = await newChart.save();
    return newChart.populate(population);
  }
  async listCharts(query, options) {
    const aggregate = this.Charts.aggregate();
    aggregate.match({
      ...query,
      // organization: new mongoose.Types.ObjectId(
      //   this.connection.user.organizationId
      // ),
    });
    const pagination = await this.Charts.aggregatePaginate(aggregate, options);
    return pagination;
  }
  async getChart(query) {
    let exist = await this.Charts.findOne(query);
    if (!exist)
      throw new APIError(
        ReasonPhrases.NOT_FOUND,
        StatusCodes.NOT_FOUND,
        "No chart found."
      );
    return exist.populate(population);
  }
  async updateChart(id, data) {
    let chart = await this.getChart({ _id: id });
    chart.description = data.description;
    chart.pipeline = data.pipeline;
    chart = await chart.save();
    return chart.populate(population);
  }
  async hardRemoveChart(id) {
    const chart = await this.getChart({ _id: id });
    if (chart) {
      await this.Charts.deleteOne({ _id: chart._id });
      return chart;
    }
  }
  async executeChart(moduleName="imsProjects", pipeline) {
    let DataModel = models[moduleName]();
    let aggregationResponse = await DataModel.aggregate(pipeline);

    // const code = await this.getImsProjectPredefineCode({ _id: id });
    // // Remove unnecessary escaping of dollar signs ('$')
    // const cleanedString = code.code.replace(/\\\$+/g, '$');
    // // Parse the cleaned JSON string into a JavaScript object
    // const aggregationPipeline = JSON.parse(cleanedString);
    // console.log({
    //   $match: {
    //     organization: new mongoose.Types.ObjectId(this.connection.user.organizationId)
    //   }
    // },aggregationPipeline)
    // // const Model = mongoose.model(targetCollection);
    // const result = await this.ImsProject.aggregate([{
    //   $match: {
    //     organization: new mongoose.Types.ObjectId(this.connection.user.organizationId)
    //   }
    // },aggregationPipeline]);
    // return {message: "Success","data": result};
  }
}

module.exports = { Chart };
