const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const {
  softDeletePlugin,
} = require("@ims-systems-00/ims-core/lib/plugins/mongoose/softDelete");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate-v2");

const Schema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
  },
  description: String,
  pipeline: [Object],
  moduleType: {
    type: String,
  },
  module: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "moduleType",
  },
  config: Object,
});

/**
 * Uses a connection to a mongodb database to create a reference to the model to be queried
 * @param {import("mongoose").Connection} connection - The connection to be used based on the tenant
 * @return {import("mongoose").Model} - The worklog model
 */
module.exports = (connection) => {
  Schema.plugin(softDeletePlugin);
  Schema.plugin(mongoosePaginate);
  Schema.plugin(mongooseAggregatePaginate);
  mongoosePaginate(Schema);
  return mongoose.model("charts", Schema);
};
module.exports.Schema = Schema;
