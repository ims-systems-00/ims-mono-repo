const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const {
  softDeletePlugin,
} = require("@ims-systems-00/ims-core/lib/plugins/mongoose/softDelete");
const { orgDataPlugin } = require("../00_plugins/orgDataPlugin");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate-v2");

const Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    imsProjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "imsProjects",
      required: true,
    },
    type: { type: String },
    color: { type: String },
    length: { type: String },
    model: { type: String },
    address: { type: String },
    lat: { type: Number },
    lng: { type: Number },
    building: { type: String },
    block: { type: String },
    level: { type: String },
    manufacturer: { type: String },
    supplier: { type: String },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
  },
  { timestamps: true }
);
/**
 * Uses a connection to a mongodb database to create a reference to the model to be queried
 * @param {import("mongoose").Connection} connection - The connection to be used based on the tenant
 * @return {import("mongoose").Model} - The worklog model
 */
module.exports = (connection) => {
  Schema.plugin(softDeletePlugin);
  Schema.plugin(mongoosePaginate);
  Schema.plugin(mongooseAggregatePaginate);
  Schema.plugin(orgDataPlugin);

  mongoosePaginate(Schema);

  return mongoose.model("imsprojectMaterials", Schema);
};
module.exports.Schema = Schema;
