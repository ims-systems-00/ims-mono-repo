// Packages
const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
// Models
const User = require("../users&auth/user");
const { moduleTypes } = require("../../schemaTemplates/utils/moduleTypes");
const metaEnums = require("./metaEnums");
const {
  organizationRef,
} = require("../../schemaTemplates/references/organization.ref");
const { orgDataPlugin } = require("../00_plugins/orgDataPlugin");
const Schema = new mongoose.Schema(
  {
    moduleType: {
      type: String,
      enum: [
        moduleTypes.cips,
        moduleTypes.documentrepositories,
        moduleTypes.incidents,
        moduleTypes.risks,
        moduleTypes.tasks,
        moduleTypes.cqcsignificantevents,
        moduleTypes.cqcdetails,
        moduleTypes.controlstatuses,
        moduleTypes.customers,
        moduleTypes.expensereports,
        moduleTypes.leaves,
        moduleTypes.documenttrees,
        moduleTypes.cccalculations,
        moduleTypes.cccarbonreductioninitiatives,
        moduleTypes.imsprojects,
        moduleTypes.imsprojectworkpackages,
      ],
    },
    module: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "moduleType",
    },
    metaInfo: {
      type: Object,
      enum: [metaEnums.documentMeta],
    },
    iconSrc: {
      type: String,
      default: "",
    },
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "groups",
      default: null,
    },
    value: {
      type: String,
      required: true,
    },
    isAutomated: {
      type: Boolean,
      required: true,
    },
    extraLogs: [
      {
        title: String,
        description: String,
        icon: String,
        image: String,
      },
    ],
    assigned: {
      to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
      on: Date,
    },
    created: {
      by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
      on: Date,
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
  (Schema.statics.populateActivity = function (activity) {
    return activity.populate([
      {
        path: "created.by",
        model: User(connection),
        select: "name email profileImageSrc",
      },
      {
        path: "assigned.to",
        model: User(connection),
        select: "name email",
      },
      { path: "module", model: mongoose.model(activity.moduleType) },
    ]);
  }),
    mongoosePaginate(Schema);
  return mongoose.model("activities", Schema);
};
module.exports.Schema = Schema;
