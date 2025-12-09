const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const {
  softDeletePlugin,
} = require("@ims-systems-00/ims-core/lib/plugins/mongoose/softDelete");
const { orgDataPlugin } = require("../00_plugins/orgDataPlugin");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate-v2");

const Schema = new mongoose.Schema(
  {
    imsProjectReportId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "imsProjectReports",
      required: true,
    },
    to: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    payload: {
      type: Object,
      required: true,
    },
    sendAt: {
      type: Date,
      required: true,
    },
    sent: {
      type: Boolean,
      default: false,
    },
    scheduleType: {
      type: String,
      enum: ["Daily", "Weekly", "Monthly", "Yearly"],
      required: true,
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
  return mongoose.model("imsProjectEmailSchedules", Schema);
};
module.exports.Schema = Schema;
