/**
 * Packages
 */
const mongoose = require("mongoose");
const { IMS_SERVICES } = require("@ims-systems-00/ims-core/lib/constants");
const mongoosePaginate = require("mongoose-paginate-v2");
const { orgDataPlugin } = require("../00_plugins/orgDataPlugin");
const Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      enum: [
        IMS_SERVICES.DSPTNHS,
        IMS_SERVICES.ISO27001,
        IMS_SERVICES.ISO27001_2022,
        IMS_SERVICES.ISO27001_2022_ANNEX_A,
        IMS_SERVICES.ISO27002,
        IMS_SERVICES.ISO9001,
        IMS_SERVICES.ISO45001,
        IMS_SERVICES.ISO20000,
        IMS_SERVICES.CQC,
        IMS_SERVICES.BS9997,
        IMS_SERVICES.ISO14001,
        IMS_SERVICES.ISO15686_5,
        IMS_SERVICES.ESG_ENVIRONMENTAL,
        IMS_SERVICES.ESG_SOCIAL,
        IMS_SERVICES.ESG_GOVERNANCE,
        IMS_SERVICES.BUILDING_SAFETY_ACT,
      ],
    },
    overview: {
      type: mongoose.Schema.Types.Mixed,
    },
    totalPercentage: {
      type: Number,
      default: 0,
    },
    controlsSelected: {
      type: Number,
      default: 0,
    },
    controlsImplemented: {
      type: Number,
      default: 0,
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
  Schema.plugin(orgDataPlugin);
  mongoosePaginate(Schema);
  return mongoose.model("complianceoverviews", Schema);
};
module.exports.Schema = Schema;
