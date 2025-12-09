/**
 * Packages
 */
const mongoose = require("mongoose");
const autoIncreament = require("@riadhossain43/mongoose-autoincrement");
const mongoosePaginate = require("mongoose-paginate-v2");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate-v2");
/**
 * Models
 */
const { attachment } = require("../../schemaTemplates/attachment");
const { createInfo, modifyInfo } = require("../../schemaTemplates/actionLog");
const { name } = require("../../schemaTemplates/metadata");
const UserModel = require("../users&auth/user");
const TaskModel = require("../taskManagement/task");
const DocumentRepositoryModel = require("./documentRepository");

const { manageVersion } = require("./hooks/manageVersion");
const {
  softDeletePlugin,
} = require("@ims-systems-00/ims-core/lib/plugins/mongoose/softDelete");
const { sourceDeletePlugin } = require("../00_plugins/sourceDeletePlugin");
const { moduleTypes } = require("../../schemaTemplates/utils/moduleTypes");
const { complianceLinkPlugin } = require("../00_plugins/complianceLinkPlugin");
const { IMS_SERVICES } = require("@ims-systems-00/ims-core/lib/constants");
const {
  organizationRef,
} = require("../../schemaTemplates/references/organization.ref");
const { orgDataPlugin } = require("../00_plugins/orgDataPlugin");


function arrayLimit(val) {
  return val.length <= 5;
}

const document = new mongoose.Schema({
  storageInfo: {
    ...attachment,
  },
  applicableModules: [
    {
      type: String,
      enum: [
        moduleTypes.risks,
        moduleTypes.cips,
        moduleTypes.audits,
        moduleTypes.compliancecontrols,
        moduleTypes.managementreviews,
        moduleTypes.suppliers,
        moduleTypes.incidents,
        moduleTypes.expensereports,
      ],
      default: [],
    },
  ],
  complianceTools: [
    {
      type: String,
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
  ],
  purpose: {
    type: String,
    enum: [
      "Process",
      "Standard operating procedure",
      "Policy",
      "Document",
      "Legal",
      "Miscellaneous",
    ],
    default: "Document",
  },
  owners: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
    validate: {
      validator: arrayLimit,
      message: "{PATH} exceeds the limit of 5",
    },
  },
  authorisation: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
      status: {
        type: String,
        enum: ["Pending", "Rejected", "Approved"],
      },
      handledOn: {
        type: Date,
        default: Date.now(),
      },
    },
  ],
  classification: {
    type: String,
    default: "",
  },
  dvID: {
    type: Number,
    default: 0,
  },
  conformance: {
    type: Number,
    default: -1,
  },
  threadId: {
    type: String,
    default: "",
  },
});

const folder = new mongoose.Schema({
  ...modifyInfo,
});

const Schema = new mongoose.Schema(
  {
    repository: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "documentrepositories",
      required: true,
    },
    name,
    type: {
      type: String,
      enum: ["document", "folder"],
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Rejected", "Published", "Archived"],
      default: "Published",
    },
    parentNode: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "documenttrees",
    },
    documentData: {
      type: document,
      default: null,
    },
    folderData: {
      type: folder,
      default: null,
    },
    reference: {
      default: "",
      type: String,
    },
    ...createInfo,
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
  Schema.plugin(autoIncreament.plugin, {
    model: "documenttrees",
    field: "ID",
  });
  Schema.plugin(softDeletePlugin);
  Schema.plugin(complianceLinkPlugin);
  Schema.plugin(orgDataPlugin);
  Schema.plugin(
    sourceDeletePlugin(moduleTypes.documenttrees, [TaskModel(connection)])
  );
  Schema.pre("validate", async function (next) {
    this.reference = `DOC-${this.ID}`;
    next();
  });
  Schema.static("populateNode", function (node) {
    return node.populate([
      {
        path: "repository",
        model: DocumentRepositoryModel(connection),
      },
      {
        path: "created.by",
        model: UserModel(connection),
        select: "name profileImageSrc",
      },
      {
        path: "documentData.owners",
        model: UserModel(connection),
        select: "name profileImageSrc",
      },
      {
        path: "documentData.authorisation.user",
        model: UserModel(connection),
        select: "name profileImageSrc",
      },
    ]);
  });
  mongoosePaginate(Schema);
  mongooseAggregatePaginate(Schema);
  manageVersion(Schema);
  return mongoose.model("documenttrees", Schema);
};
module.exports.Schema = Schema;
