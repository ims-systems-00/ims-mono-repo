/**
 * Packages
 */
const mongoose = require("mongoose");
const { ROLE_TYPES } = require("@ims-systems-00/ims-core/lib/constants");
const mongoosePaginate = require("mongoose-paginate-v2");
/**
 * Models
 */
const IamPolicy = require("../ourIms/iamPolicy");
const {
  organizationRef,
} = require("../../schemaTemplates/references/organization.ref");
const { orgDataPlugin } = require("../00_plugins/orgDataPlugin");

const Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: [ROLE_TYPES.PREMITIVE, ROLE_TYPES.CUSTOM],
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
  Schema.plugin(orgDataPlugin)
  Schema.statics.populateIamRole = function (role) {
      return role
        .populate([
          { path: "policy", modle: IamPolicy(connection), select: "name" },
        ])
         ;
    },
  mongoosePaginate(Schema);
  return mongoose.model("roles", Schema);
};
module.exports.Schema = Schema;
