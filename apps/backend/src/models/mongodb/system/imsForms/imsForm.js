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
    description: {
      type: String,
      default: "",
    },
    submissionCount: {
      type: Number,
      default: 0,
    },
    collaboration: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    themeForegroundColour: {
      type: String,
      default: "#FFFFFF",
    },

    themeBackgroundColour: {
      type: String,
      default: "#f9fafb",
    },
    thumbnail: {
      type: String,
      default: "",
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
  return mongoose.model("imsForms", Schema);
};
module.exports.Schema = Schema;
