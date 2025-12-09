const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const {
  softDeletePlugin,
} = require("@ims-systems-00/ims-core/lib/plugins/mongoose/softDelete");
const { orgDataPlugin } = require("../00_plugins/orgDataPlugin");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate-v2");
const autoIncreament = require("@riadhossain43/mongoose-autoincrement");
const { groupRef } = require("../../schemaTemplates/references/group.ref");
const { PROJECT_STATUSES, RAG_STATUS } = require("./enums");
const {
  IMS_FORM_FIELDS,
} = require("../../schemaTemplates/references/typesAndEnums");

const Schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: Date,

    group: {
      ...groupRef,
    },
    attachments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "imsProjectAttachments",
      },
    ],
    owners: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    status: {
      type: String,
      enum: Object.values(PROJECT_STATUSES),
      default: PROJECT_STATUSES.PLANNED,
    },
    ragStatus: {
      type: String,
      enum: Object.values(RAG_STATUS),
      default: RAG_STATUS.AMBER,
    },
    repository: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "documentrepositories",
    },
    expectedTotalBudget: {
      type: Number,
      default: 0,
    },
    reference: {
      default: "",
      type: String,
    },
    expectedStartdate: {
      type: Date,
    },
    expectedEndDate: {
      type: Date,
    },
    workPackageStatuses: [
      {
        value: String,
      },
    ],
    gvProjectCharter: { type: Boolean, default: false },
    gvWorkBreakDownStructure: { type: Boolean, default: false },
    gvQualityManagementPlan: { type: Boolean, default: false },
    gvProcurementPlan: { type: Boolean, default: false },
    gvProjectManagementPlan: { type: Boolean, default: false },
    gvRiskManagementPlan: { type: Boolean, default: false },
    gvCommunicationPlan: { type: Boolean, default: false },
    gvChangeManagementPlan: { type: Boolean, default: false },
    gvLessonsLearnedReport: { type: Boolean, default: false },
    gvStatusReport: { type: Boolean, default: false },
    sections: [
      {
        name: { type: String, required: true },
        customFields: [
          {
            type: {
              type: String,
              required: true,
              enum: Object.values(IMS_FORM_FIELDS),
            },
            label: { type: String, required: true, default: "" },
            validations: {
              plainTextRules: String,
              dateRule: mongoose.Schema.Types.Mixed,
              numericRule: mongoose.Schema.Types.Mixed,
            },
            placeholder: { type: String, default: "" },
            isRequired: Boolean,
            maxLength: Number,
            minDate: Date,
            maxDate: Date,
            value: { type: mongoose.Schema.Types.Mixed },
            options: { type: [String] },
          },
        ],
      },
    ],
    projectChecklistViewed: {
      type: Boolean,
      default: false,
    },
    settingsRiskTabPreference: { type: Boolean, default: true },
    settingsOfiTabPreference: { type: Boolean, default: true },
    settingsKpiTabPreference: { type: Boolean, default: true },
    settingsOfiTabGantTabPreference: { type: Boolean, default: true },
    settingsBudgetTabPreference: { type: Boolean, default: true },
    settingsMembersTabPreference: { type: Boolean, default: true },
    settingsMaterialsTabPreference: { type: Boolean, default: true },
    settingsDataImportTabPreference: { type: Boolean, default: true },
    contractValue: {
      type: Number,
      default: 0,
    },
    projectAddress: {
      type: String,
      default: "",
    },
    jobNumber: {
      type: String,
      default: "",
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
  Schema.plugin(softDeletePlugin);
  Schema.plugin(mongoosePaginate);
  Schema.plugin(mongooseAggregatePaginate);
  Schema.plugin(orgDataPlugin);
  Schema.plugin(autoIncreament.plugin, { model: "imsprojects", field: "ID" });
  mongoosePaginate(Schema);
  Schema.pre("validate", async function (next) {
    this.reference = `PR0J-${this.ID}`;
    next();
  });
  return mongoose.model("imsprojects", Schema);
};
module.exports.Schema = Schema;
