/**
 * Packages
 */
const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
/**
 * Models
 */
const IamGroup = require("../ourIms/iamGroup");
const User = require("../users&auth/user");
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
    location: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    groups: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "groups",
      default: [],
    },
    created: {
      by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
      on: {
        type: Date,
        default: Date.now,
      },
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
  (Schema.statics.populatePremise = function (premise) {
    return premise
      .populate([
        { path: "groups", model: IamGroup(connection), select: "name" },
        {
          path: "created.by",
          model: User(connection),
          select: "name profileImageSrc",
        },
      ])
       ;
  }),
    mongoosePaginate(Schema);
  return mongoose.model("grouppremises", Schema);
};
module.exports.Schema = Schema;
