/**
 * Packages
 */
const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const {
  IMS_SERVICES,
  GROUP_TYPE,
} = require("@ims-systems-00/ims-core/lib/constants");
/**
 * Models
 */
const IamPolicy = require("../ourIms/iamPolicy");
const { orgDataPlugin } = require("../00_plugins/orgDataPlugin");

const Schema = new mongoose.Schema(
  {
    userLicenses: {
      superUser: {
        allocated: {
          type: Number,
          default: 0,
        },
        used: {
          type: Number,
          default: 0,
        },
      },
      hosUser: {
        allocated: {
          type: Number,
          default: 0,
        },
        used: {
          type: Number,
          default: 0,
        },
      },
      basicUser: {
        allocated: {
          type: Number,
          default: 0,
        },
        used: {
          type: Number,
          default: 0,
        },
      },
      auditorUser: {
        allocated: {
          type: Number,
          default: 0,
        },
        used: {
          type: Number,
          default: 0,
        },
      },
      complianceTools: {
        type: [String],
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
          IMS_SERVICES.CRM,
          IMS_SERVICES.ISO15686_5,
          IMS_SERVICES.ESG_ENVIRONMENTAL,
          IMS_SERVICES.ESG_GOVERNANCE,
          IMS_SERVICES.ESG_SOCIAL,
        ],
      },
    },
    totalMembers: {
      type: Number,
      default: 0,
    },
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: Object.values(GROUP_TYPE),
      default: GROUP_TYPE.INTERNAL_BU,
    },
    responsibility: {
      type: String,
    },
    details: {
      type: Object,
      required: true,
    },
    policy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "accesspolicies",
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
  Schema.plugin(orgDataPlugin);
  Schema.statics.populateIamGroup = function (group) {
    return group.populate([
      { path: "policy", modle: IamPolicy(connection), select: "name" },
    ]);
  };
  mongoosePaginate(Schema);
  return mongoose.model("groups", Schema);
};
module.exports.Schema = Schema;
