/**
 * Packages
 */
const mongoose = require("mongoose");
const autoIncreament = require("@riadhossain43/mongoose-autoincrement");
const mongoosePaginate = require("mongoose-paginate-v2");
/**
 * Models
 */
const IamGroup = require("../ourIms/iamGroup");
const UserModel = require("../users&auth/user");
const CustomerModel = require("./customer");
const { attachment } = require("../../schemaTemplates/attachment");
const {
  organizationRef,
} = require("../../schemaTemplates/references/organization.ref");
const { orgDataPlugin } = require("../00_plugins/orgDataPlugin");

const Schema = new mongoose.Schema(
  {
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "groups",
    },
    bundle: String,
    rootCampaign: {
      type: Boolean,
      default: false,
    },
    closed: {
      type: Boolean,
      default: false,
    },
    name: {
      type: String,
    },
    target: [
      {
        type: String,
        enum: ["Live", "Prospect", "Warm lead", "Qualified", "Proposal"],
      },
    ],
    customAudience: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "customers",
      },
    ],
    subject: {
      type: String,
      default: "",
    },
    sentFrom: {
      email: {
        type: String,
        default: "",
      },
      name: {
        type: String,
        default: "",
      },
    },
    body: {
      type: String,
      default: "",
    },
    attachments: [attachment],
    status: {
      type: String,
      enum: ["Draft", "Queued", "Sent"],
      default: "Draft",
    },
    launchedAt: Date,
    created: {
      on: {
        type: Date,
      },
      by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
    },
    totalCustomers: {
      type: Number,
      default: 0,
    },
    reference: {
      default: "",
      type: String,
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
  autoIncreament.initialize(connection);
  Schema.plugin(autoIncreament.plugin, {
    model: "emailcampaigns",
    field: "ID",
  });
  Schema.plugin(orgDataPlugin);
  Schema.pre("validate", async function (next) {
    this.reference = `EC-${this.ID}`;
    next();
  });
  (Schema.statics.populateCampaign = function (campaign) {
    return campaign
      .populate([
        { path: "group", model: IamGroup(connection), select: "name " },
        {
          path: "customAudience",
          model: CustomerModel(connection),
          select: "name reference",
        },
        {
          path: "attachments.modified.by",
          model: UserModel(connection),
          select: "name profileImageSrc",
        },
        {
          path: "created.by",
          model: UserModel(connection),
          select: "name email profileImageSrc",
        },
      ])
       ;
  }),
    mongoosePaginate(Schema);
  return mongoose.model("emailcampaigns", Schema);
};
module.exports.Schema = Schema;
