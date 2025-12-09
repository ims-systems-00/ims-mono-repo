/**
 * Packages
 */
const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
/**
 * Models
 */
const EmailCampaign = require("./emailCampaign");
const {
  organizationRef,
} = require("../../schemaTemplates/references/organization.ref");
const { orgDataPlugin } = require("../00_plugins/orgDataPlugin");

const Schema = new mongoose.Schema(
  {
    campaign: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "emailcampaigns",
    },
    recipients: [
      {
        name: {
          type: String,
        },
        email: {
          type: String,
        },
      },
    ],
    total: {
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
  Schema.statics.populateList = function (campaign) {
      return campaign
        .populate([
          {
            path: "campaign",
            model: EmailCampaign(connection),
            select: "name",
          },
        ])
         ;
    },
  mongoosePaginate(Schema);
  return mongoose.model("campaigndeliveries", Schema);
};
module.exports.Schema = Schema;
