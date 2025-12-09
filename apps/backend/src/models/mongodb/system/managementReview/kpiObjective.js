/**
 * Packages
 */
const mongoose = require("mongoose");
const autoIncreament = require("@riadhossain43/mongoose-autoincrement");
const mongoosePaginate = require("mongoose-paginate-v2");
const { IMS_POLICIES } = require("@ims-systems-00/ims-core/lib/constants");
/**
 * Models
 */
const NotificationModel = require("../notification/notification");
const UserModel = require("../users&auth/user");
const IamGroupModel = require("../ourIms/iamGroup");
const IamRoleModel = require("../ourIms/iamRole");
const {
  organizationRef,
} = require("../../schemaTemplates/references/organization.ref");
const { orgDataPlugin } = require("../00_plugins/orgDataPlugin");
const { moduleTypes } = require("../../schemaTemplates/utils/moduleTypes");
const Schema = new mongoose.Schema(
  {
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "groups",
      default: null,
    },
    moduleType: {
      type: String,
      enum: [
        moduleTypes.cips,
        moduleTypes.documentrepositories,
        moduleTypes.incidents,
        moduleTypes.risks,
        moduleTypes.tasks,
        moduleTypes.controlstatuses,
        moduleTypes.customers,
        moduleTypes.expensereports,
        moduleTypes.leaves,
        moduleTypes.documenttrees,
        moduleTypes.cccalculations,
        moduleTypes.imsprojects,
        moduleTypes.imsprojectworkpackages,
      ],
    },
    module: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "moduleType",
    },
    targetValue: {
      type: Number,
      default: 0,
    },
    currentValue: {
      type: Number,
      default: 0,
    },
    unit: {
      type: String,
      default: "",
    },
    progressPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    value: {
      type: String,
    },
    privacy: {
      type: String,
      default: "Organisational",
      enum: ["Organisational", "Business unit"],
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
  autoIncreament.initialize(connection);
  Schema.plugin(orgDataPlugin);
  Schema.plugin(autoIncreament.plugin, { model: "kpiobjectives", field: "ID" });
  Schema.plugin(orgDataPlugin);
  Schema.pre("validate", async function (next) {
    this.reference = `KPI-${this.ID}`;
    next();
  });
  Schema.pre("save", function (next) {
    if (this.targetValue > 0) {
      this.progressPercentage = (this.currentValue / this.targetValue) * 100;
    }

    if (this.progressPercentage >= 100) {
      this.status = "Completed";
    }
    next();
  });
  (Schema.statics.populateKpiObjective = function (kpiobjective) {
    return kpiobjective.populate([
      { path: "group", modle: IamGroupModel(connection), select: "name" },
      {
        path: "created.by",
        modle: UserModel(connection),
        select: "name profileImageSrc",
      },
    ]);
  }),
    mongoosePaginate(Schema);
  return mongoose.model("kpiobjectives", Schema);
};
module.exports.Schema = Schema;
