/**
 * Packages
 */
const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
/**
 * Models
 */
const {
  ACCESS_SCOPE,
  ACCESS_POLICY_TYPE,
  POLICY_USAGE,
  EFFECTS,
} = require("@ims-systems-00/ims-core/lib/constants");
const { orgDataPlugin } = require("../00_plugins/orgDataPlugin");

const Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    usedFor: {
      type: String,
      enum: [POLICY_USAGE.BUSINESS_UNIT, POLICY_USAGE.ROLES],
      default: POLICY_USAGE.BUSINESS_UNIT,
    },
    type: {
      type: String,
      enum: [
        ACCESS_POLICY_TYPE.IMS_MANAGED,
        ACCESS_POLICY_TYPE.CUSTOMER_MANAGED,
      ],
    },
    accessScope: {
      type: String,
      enum: [ACCESS_SCOPE.ALL_BUSINESS_UNIT, ACCESS_SCOPE.SINGLE_BUSINESS_UNIT],
    },
    statement: [
      {
        service: {
          type: String,
        },
        actions: {
          type: [String],
        },
        effect: {
          type: String,
          enum: [EFFECTS.ALLOW, EFFECTS.BLOCK],
        },
      },
    ],
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
  Schema.plugin(orgDataPlugin)
  Schema.statics = {};
  mongoosePaginate(Schema);
  return mongoose.model("accesspolicies", Schema);
};
module.exports.Schema = Schema;
