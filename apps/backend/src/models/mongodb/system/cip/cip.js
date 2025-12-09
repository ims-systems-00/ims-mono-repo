// Packages
const mongoosePaginate = require("mongoose-paginate-v2");
const autoIncreament = require("@riadhossain43/mongoose-autoincrement");
const mongoose = require("mongoose");

// Models
const UserModel = require("../users&auth/user");
const IamGroupModel = require("../ourIms/iamGroup");
const TaskModel = require("../taskManagement/task");
const { nudgeMetaData } = require("../../schemaTemplates/nudgeMetadata");
const { attachment } = require("../../schemaTemplates/attachment");
const sourceTemplate = require("../../schemaTemplates/source");
const { complianceLinkPlugin } = require("../00_plugins/complianceLinkPlugin");
const { sourceDeletePlugin } = require("../00_plugins/sourceDeletePlugin");
const { moduleTypes } = require("../../schemaTemplates/utils/moduleTypes");
const { orgDataPlugin } = require("../00_plugins/orgDataPlugin");
const { sourceLinkPlugin } = require("../00_plugins/sourceLinkPlugin");
const Schema = new mongoose.Schema(
  {
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "groups",
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    title: {
      type: String,
      required: true,
    },
    opportunityForImprovement: {
      type: String,
      required: true,
    },
    cost: {
      type: Number,
    },
    actions: [
      {
        value: {
          type: String,
        },
        created: {
          on: {
            type: Date,
          },
          by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
          },
        },
      },
    ],
    attachments: [attachment],
    implemented: {
      status: {
        type: String,
        enum: ["In Progress", "Pending", "Implemented"],
        default: "Pending",
      },
      by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
      on: {
        type: Date,
      },
    },
    ...sourceTemplate,
    created: {
      by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
      on: {
        type: Date,
      },
    },
    reference: {
      default: "",
      type: String,
    },
    ...nudgeMetaData,
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
  Schema.plugin(autoIncreament.plugin, { model: "cips", field: "ID" });
  Schema.plugin(complianceLinkPlugin);
  Schema.plugin(orgDataPlugin);
  Schema.plugin(sourceDeletePlugin(moduleTypes.cips, [TaskModel(connection)]));
  Schema.plugin(
    sourceLinkPlugin([
      moduleTypes.tasks,
      moduleTypes.risks,
      moduleTypes.incidents,
      moduleTypes.audits,
      moduleTypes.cips,
      moduleTypes.customers,
      moduleTypes.documenttrees,
      moduleTypes.expensereports,
      moduleTypes.managementreviews,
      moduleTypes.kpiobjectives,
      moduleTypes.suppliers,
      moduleTypes.imsprojects,
      moduleTypes.imsprojectworkpackages,
    ])
  );
  Schema.pre("validate", async function (next) {
    this.reference = `OFI-${this.ID}`;
    next();
  });
  (Schema.statics.populateCip = function (cip) {
    let sourcePopulation = cip?.source?.moduleType
      ? [
          {
            path: "source.module",
            model: mongoose.model(cip?.source?.moduleType),
          },
        ]
      : [];
    return cip.populate([
      { path: "group", model: IamGroupModel(connection), select: "name" },
      {
        path: "owner",
        model: UserModel(connection),
        select: "name profileImageSrc",
      },
      {
        path: "implemented.by",
        model: UserModel(connection),
        select: "name profileImageSrc",
      },
      {
        path: "created.by",
        model: UserModel(connection),
        select: "name profileImageSrc",
      },
      {
        path: "actions.created.by",
        model: UserModel(connection),
        select: "name profileImageSrc",
      },
      {
        path: "attachments.modified.by",
        model: UserModel(connection),
        select: "name",
      },
      ...sourcePopulation,
    ]);
  }),
    mongoosePaginate(Schema);
  return mongoose.model("cips", Schema);
};
module.exports.Schema = Schema;
