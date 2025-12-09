/**
 * Packages
 */
const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const autoIncreament = require("@riadhossain43/mongoose-autoincrement");
/**
 * Models
 */
const UserModel = require("../users&auth/user");
const IamGroupModel = require("../ourIms/iamGroup");
const TaskModel = require("../taskManagement/task");
const TagsAndCategories = require("../customisation/tagsAndCategories");
const { groupRef } = require("../../schemaTemplates/references/group.ref");
const { attachment } = require("../../schemaTemplates/attachment");

const {
  getImsMetaInfoForSchema,
} = require("../../utils/getImsMetaInfoForSchema");
const { sourceDeletePlugin } = require("../00_plugins/sourceDeletePlugin");
const { moduleTypes } = require("../../schemaTemplates/utils/moduleTypes");
const {
  organizationRef,
} = require("../../schemaTemplates/references/organization.ref");
const { orgDataPlugin } = require("../00_plugins/orgDataPlugin");
const Schema = new mongoose.Schema(
  {
    group: {
      ...groupRef,
    },
    tagsAndCategories: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tagsAndCategories",
    },
    logo: {
      storageInfo: attachment,
      signedUrl: {
        type: String,
      },
      src: {
        type: String,
        default:
          "https://assets.imssystems.tech/images/system/avatar-placeholder.jpg",
      },
    },
    isChampion: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["Open", "Closed", "Lost", "Abandoned"],
      default: "Open",
    },
    companyNumber: {
      type: String,
      alias: "Company number",
      ...getImsMetaInfoForSchema({
        isClientImportable: true,
      }),
    },
    probability: {
      type: Number,
      default: 10,
      alias: "Probability",
      ...getImsMetaInfoForSchema({
        isClientImportable: true,
      }),
    },
    source: {
      type: String,
      alias: "Source",
      ...getImsMetaInfoForSchema({
        isClientImportable: true,
      }),
    },
    stage: {
      type: String,
      enum: ["Live", "Prospect", "Warm lead", "Qualified", "Proposal"],
      default: "Prospect",
      alias: "Organisational profile",
      ...getImsMetaInfoForSchema({
        isClientImportable: true,
      }),
    },
    phoneNumber: {
      type: String,
      alias: "Phone number",
      ...getImsMetaInfoForSchema({
        isClientImportable: true,
      }),
    },
    name: {
      type: String,
      required: true,
      alias: "Customer name",
      ...getImsMetaInfoForSchema({
        isClientImportable: true,
      }),
    },
    buildingName: {
      type: String,
      alias: "Building name",
      ...getImsMetaInfoForSchema({
        isClientImportable: true,
      }),
    },
    streetName: {
      type: String,
      alias: "Street name",
      ...getImsMetaInfoForSchema({
        isClientImportable: true,
      }),
    },
    postCode: {
      type: String,
      alias: "Post code",
      ...getImsMetaInfoForSchema({
        isClientImportable: true,
      }),
    },
    town: {
      type: String,
      alias: "Town",
      ...getImsMetaInfoForSchema({
        isClientImportable: true,
      }),
    },
    accountManager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      alias: "Account manager",
      ...getImsMetaInfoForSchema({
        isClientImportable: true,
        isOwnerShipControler: true,
      }),
    },
    accountNumber: {
      type: String,
      default: "",
      alias: "Account number",
      ...getImsMetaInfoForSchema({
        isClientImportable: true,
      }),
    },
    primaryContact: {
      type: String,
      default: "",
      alias: "Primary contact",
      ...getImsMetaInfoForSchema({
        isClientImportable: true,
      }),
    },
    primaryEmail: {
      type: String,
      required: true,
      alias: "Primary email",
      ...getImsMetaInfoForSchema({
        isClientImportable: true,
      }),
    },
    secondaryContact: {
      type: String,
      default: "",
      alias: "Secondary contact",
      ...getImsMetaInfoForSchema({
        isClientImportable: true,
      }),
    },
    secondaryEmail: {
      type: String,
      default: "",
      alias: "Secondary email",
      ...getImsMetaInfoForSchema({
        isClientImportable: true,
      }),
    },
    serviceProvision: {
      type: String,
      default: "",
      default: "",
      alias: "Service provision",
      ...getImsMetaInfoForSchema({
        isClientImportable: true,
      }),
    },
    contractValue: {
      type: Number,
      default: 0,
      default: "",
      alias: "Contract value",
      ...getImsMetaInfoForSchema({
        isClientImportable: true,
      }),
    },
    contractStartDate: {
      type: Date,
      default: Date.now,
      alias: "Contract start date",
      ...getImsMetaInfoForSchema({
        isClientImportable: true,
      }),
    },
    contractEndDate: {
      type: Date,
      alias: "Contract end date",
      ...getImsMetaInfoForSchema({
        isClientImportable: true,
      }),
    },
    reviewDate: {
      type: Date,
      alias: "Review date",
      ...getImsMetaInfoForSchema({
        isClientImportable: true,
      }),
    },
    attachments: [attachment],
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
    updated: {
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
    notes: {
      type: String,
      default: "",
      alias: "Notes",
      ...getImsMetaInfoForSchema({
        isClientImportable: true,
      }),
    },
    reasonForLoss: {
      type: String,
      alias: "Reason for loss",
      ...getImsMetaInfoForSchema({
        isClientImportable: true,
      }),
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
  Schema.plugin(autoIncreament.plugin, { model: "customers", field: "ID" });
  Schema.plugin(
    sourceDeletePlugin(moduleTypes.customers, [TaskModel(connection)])
  );
  Schema.pre("validate", async function (next) {
    this.reference = `CUS-${this.ID}`;
    next();
  });
  (Schema.statics.populateCustomer = function (supplier) {
    return supplier.populate([
      {
        path: "group",
        model: IamGroupModel(connection),
        select: "name email",
      },
      {
        path: "tagsAndCategories",
        model: TagsAndCategories(connection),
        select: "name",
      },
      {
        path: "accountManager",
        model: UserModel(connection),
        select: "name email profileImageSrc",
      },
      {
        path: "attachments.modified.by",
        model: UserModel(connection),
        select: "name",
      },
      {
        path: "created.by",
        model: UserModel(connection),
        select: "name email profileImageSrc",
      },
      {
        path: "updated.by",
        model: UserModel(connection),
        select: "name email profileImageSrc",
      },
    ]);
  }),
    mongoosePaginate(Schema);
  return mongoose.model("customers", Schema);
};
module.exports.Schema = Schema;
