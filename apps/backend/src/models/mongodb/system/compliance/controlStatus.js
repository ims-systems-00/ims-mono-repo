/**
 * Packages
 */
const mongoose = require("mongoose");
const { IMS_SERVICES } = require("@ims-systems-00/ims-core/lib/constants");
const mongoosePaginate = require("mongoose-paginate-v2");
/**
 * Models
 */
const IamGroup = require("../ourIms/iamGroup");
const UserModel = require("../users&auth/user");
const ComplianceTool = require("../compliance/complianceControls");
const { attachment } = require("../../schemaTemplates/attachment");
const { orgDataPlugin } = require("../00_plugins/orgDataPlugin");

const Schema = new mongoose.Schema(
  {
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "groups",
      default: null,
    },
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
    control: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "compliancecontrols",
    },
    responsibleUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    accountableUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    consultedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    informedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    compliancePercentage: {
      type: Number,
      default: 0,
    },
    numberOfCompliantChildren: {
      type: Number,
      default: 0,
    },
    selected: {
      type: String,
      enum: ["Selected", "Not selected"],
      default: "Not selected",
    },
    state: {
      type: String,
      enum: [
        "Yes",
        "No",
        "Implemented",
        "Partially implemented",
        "Not implemented",
      ],
      default: "Not implemented",
    },
    evidences: [attachment],
    responsibleUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      default: null,
    },
    accountableUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      default: null,
    },
    consultedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      default: null,
    },
    informedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      default: null,
    },
    updated: {
      on: Date,
      by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
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
  Schema.statics.populateControl = function (control) {
    return control.populate([
      { path: "group", model: IamGroup(connection), select: "name" },
      { path: "control", model: ComplianceTool(connection) },
      {
        path: "evidences.modified.by",
        model: UserModel(connection),
        select: "name profileImageSrc",
      },
      {
        path: "updated.by",
        model: UserModel(connection),
        select: "name profileImageSrc",
      },
    ]);
  };
  mongoosePaginate(Schema);
  return mongoose.model("controlstatuses", Schema);
};
