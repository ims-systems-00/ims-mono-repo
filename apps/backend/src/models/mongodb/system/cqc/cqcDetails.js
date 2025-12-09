/**
 * Packages
 */
const mongoosePaginate = require("mongoose-paginate-v2");
const mongoose = require("mongoose");
/**
 * Models
 */
const COQCTool = require("../cqc/cqcTool");
const IamGroup = require("../ourIms/iamGroup");
const UserModel = require("../users&auth/user");
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
    control: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "cqctools",
    },
    compliancePercentage: {
      type: Number,
      default: 0,
    },
    numberOfCompliantChildren: {
      type: Number,
      default: 0,
    },
    adopted: {
      type: String,
      enum: ["Yes", "No"],
      default: "No",
    },
    comments: [
      {
        value: String,
        created: {
          on: {
            type: Date,
            default: Date.now,
          },
          by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
          },
        },
      },
    ],
    evidences: [attachment],
  },
  { timestamps: true }
);

module.exports = (connection) => {
  Schema.plugin(orgDataPlugin)
  Schema.statics.populateCQCDetail = function (kloe) {
      return kloe
        .populate([
          { path: "group", model: IamGroup(connection), select: "name" },
          {
            path: "evidences.modified.by",
            model: UserModel(connection),
            select: "name profileImageSrc ",
          },
          { path: "control", model: COQCTool(connection) },
        ])
         ;
    },
  mongoosePaginate(Schema);
  return mongoose.model("cqcdetails", Schema);
};
module.exports.Schema = Schema;
