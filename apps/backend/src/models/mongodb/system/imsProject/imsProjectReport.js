const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const {
  softDeletePlugin,
} = require("@ims-systems-00/ims-core/lib/plugins/mongoose/softDelete");
const { orgDataPlugin } = require("../00_plugins/orgDataPlugin");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate-v2");

const Schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      default: "",
    },
    imsProjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "imsProjects",
      required: true,
    },
    sections: [
      {
        type: { type: String, enum: ["Chart", "Table", "Draft"] },
        content: Object,
      },
    ],
    interval: {
      type: String,
      enum: ["Weekly", "Monthly", "Yearly"],
      required: true,
      default: "Monthly",
    },
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
  return mongoose.model("imsprojectreports", Schema);
};
module.exports.Schema = Schema;
