const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const {
  softDeletePlugin,
} = require("@ims-systems-00/ims-core/lib/plugins/mongoose/softDelete");
const { orgDataPlugin } = require("../00_plugins/orgDataPlugin");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate-v2");
const autoIncreament = require("@riadhossain43/mongoose-autoincrement");

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
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: Date,
    progressPercentage: {
      type: Number,
      required: true,
      default: 0,
    },
    type: {
      type: String,
      required: true,
      enum: ["Task", "Milestone", "Task Group"],
      default: "Task",
    },
    groupWorkPackage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "imsprojectworkpackages",
      default: null,
    },
    groupColorHex: {
      type: String,
      default: "#000000",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    imsProjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "imsProjects",
      required: true,
    },
    status: {
      type: String,
      default: "No Status",
    },
    priority: {
      type: String,
      enum: ["Critical", "High", "Medium", "Low"],
      default: "Medium",
    },
    checklist: { type: String },
    tags: { type: String },
    reference: {
      default: "",
      type: String,
    },

    // assignedTo, attachment not implemented
  },
  { timestamps: true }
);
/**
 * Uses a connection to a mongodb database to create a reference to the model to be queried
 * @param {import("mongoose").Connection} connection - The connection to be used based on the tenant
 * @return {import("mongoose").Model} - The worklog model
 */
module.exports = (connection) => {
  autoIncreament.initialize(connection);
  Schema.plugin(softDeletePlugin);
  Schema.plugin(mongoosePaginate);
  Schema.plugin(mongooseAggregatePaginate);
  Schema.plugin(orgDataPlugin);
  Schema.plugin(autoIncreament.plugin, {
    model: "imsprojectworkpackages",
    field: "ID",
  });
  Schema.pre("validate", async function (next) {
    this.reference = `WRKP-${this.ID}`;
    next();
  });
  mongoosePaginate(Schema);
  return mongoose.model("imsprojectworkpackages", Schema);
};
module.exports.Schema = Schema;
