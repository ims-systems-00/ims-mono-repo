/**
 * Packages
 */
const mongoose = require("mongoose");
const autoIncreament = require("@riadhossain43/mongoose-autoincrement");
const mongoosePaginate = require("mongoose-paginate-v2");
/**
 * Models
 */
const HardwareAsset = require("../inventory/hardwareAsset");
const InformationAsset = require("../inventory/informationAsset");
const PeopleAsset = require("../inventory/peopleAsset");
const PremiseAsset = require("../inventory/premiseAsset");
const SoftwareAsset = require("../inventory/softwareAsset");
const UserModel = require("../users&auth/user");
const TagsAndCategories = require("../customisation/tagsAndCategories");
const TaskModel = require("../taskManagement/task");
const IamGroupModel = require("../ourIms/iamGroup");
const { nudgeMetaData } = require("../../schemaTemplates/nudgeMetadata");
const sourceTemplate = require("../../schemaTemplates/source");
const { groupRef } = require("../../schemaTemplates/references/group.ref");
const { attachment } = require("../../schemaTemplates/attachment");
const { sourceLinkPlugin } = require("../00_plugins/sourceLinkPlugin");

const {
  getImsMetaInfoForSchema,
} = require("../../utils/getImsMetaInfoForSchema");
const { complianceLinkPlugin } = require("../00_plugins/complianceLinkPlugin");
const { sourceDeletePlugin } = require("../00_plugins/sourceDeletePlugin");
const { moduleTypes } = require("../../schemaTemplates/utils/moduleTypes");
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
    asset: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "assetReferarence",
    },
    title: {
      type: String,
      required: true,
      alias: "Risk title",
      ...getImsMetaInfoForSchema({
        isClientImportable: true,
      }),
    },
    assetReferarence: {
      type: String,
      enum: [
        "Hardwareasset",
        "Softwareasset",
        "Peopleasset",
        "Premiseasset",
        "Organisationalasset",
        "Informationasset",
        "Clinicalasset",
      ],
    },
    type: {
      type: String,
      required: true,
      enum: [
        "Hardware",
        "Software",
        "People",
        "Premise",
        "Organisational",
        "Clinical",
      ],
      alias: "Risk category",
      ...getImsMetaInfoForSchema({
        isClientImportable: true,
      }),
    },
    accepted: {
      status: {
        type: Boolean,
        default: false,
      },
      by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
      on: {
        type: Date,
      },
    },
    mitigated: {
      status: {
        type: Boolean,
        default: false,
      },
      by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
      on: {
        type: Date,
      },
    },
    escalated: {
      status: {
        type: Boolean,
        default: false,
      },
      by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
      on: {
        type: Date,
      },
    },
    description: {
      type: String,
      default: "",
      alias: "Description",
      ...getImsMetaInfoForSchema({
        isClientImportable: true,
      }),
    },
    controlsAndMitigation: {
      type: String,
      default: "",
      alias: "Controls and mitigation",
      ...getImsMetaInfoForSchema({
        isClientImportable: true,
      }),
    },
    acceptanceRational: {
      type: String,
      default: "",
      alias: "Acceptance rational",
      ...getImsMetaInfoForSchema({
        isClientImportable: true,
      }),
    },
    decisionMaker: {
      type: String,
      default: "",
      alias: "Decision maker",
      ...getImsMetaInfoForSchema({
        isClientImportable: true,
      }),
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      alias: "Risk owner",
      ...getImsMetaInfoForSchema({
        isClientImportable: true,
        isOwnerShipControler: true,
      }),
    },
    score: {
      likelihood: {
        initial: {
          type: Number,
          default: 1,
          required: true,
          alias: "Likelihood",
          ...getImsMetaInfoForSchema({
            isClientImportable: true,
          }),
        },
        current: {
          type: Number,
          default: 1,
        },
      },
      consequence: {
        initial: {
          type: Number,
          default: 1,
          required: true,
          alias: "Consequence",
          ...getImsMetaInfoForSchema({
            isClientImportable: true,
          }),
        },
        current: {
          type: Number,
          default: 1,
        },
      },
      total: {
        initial: {
          type: Number,
          default: 1,
        },
        current: {
          type: Number,
          default: 1,
        },
      },
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
      },
    },
    ...sourceTemplate,
    ...nudgeMetaData,
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
  Schema.plugin(autoIncreament.plugin, { model: "risks", field: "ID" });
  Schema.plugin(complianceLinkPlugin);
  Schema.plugin(orgDataPlugin);
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
  Schema.plugin(sourceDeletePlugin(moduleTypes.risks, [TaskModel(connection)]));
  Schema.pre("validate", async function (next) {
    this.reference = `RK-${this.ID}`;
    this.score.total.initial =
      this.score?.likelihood?.initial * this.score?.consequence?.initial;
    next();
  });
  Schema.pre("save", async function (next) {
    this.score.likelihood.current = this.score?.likelihood?.initial;
    this.score.consequence.current = this.score?.consequence?.initial;
    this.score.total.current =
      this.score?.likelihood?.initial * this.score?.consequence?.initial;
    next();
  });
  Schema.statics.populateRisk = function (risk) {
    let sourcePopulation = risk?.source?.moduleType
      ? [
          {
            path: "source.module",
            model: mongoose.model(risk?.source?.moduleType),
          },
        ]
      : [];
    return risk.populate([
      {
        path: "owner",
        model: UserModel(connection),
        select: "name email profileImageSrc",
      },
      {
        path: "mitigated.by",
        model: UserModel(connection),
        select: "name profileImageSrc",
      },
      {
        path: "accepted.by",
        model: UserModel(connection),
        select: "name profileImageSrc",
      },
      {
        path: "tagsAndCategories",
        model: TagsAndCategories(connection),
        select: "name",
      },
      {
        path: "escalated.by",
        model: UserModel(connection),
        select: "name profileImageSrc",
      },
      { path: "group", model: IamGroupModel(connection), select: "name" },
      {
        path: "created.by",
        model: UserModel(connection),
        select: "name profileImageSrc",
      },
      {
        path: "updated.by",
        modle: UserModel(connection),
        select: "name profileImageSrc",
      },
      {
        path: "attachments.modified.by",
        model: UserModel(connection),
        select: "name",
      },
      {
        path: "asset",
        model:
          risk.assetReferarence === "Hardwareasset"
            ? HardwareAsset(connection)
            : risk.assetReferarence === "Softwareasset"
            ? SoftwareAsset(connection)
            : risk.assetReferarence === "Peopleasset"
            ? PeopleAsset(connection)
            : risk.assetReferarence === "Premiseasset"
            ? PremiseAsset(connection)
            : InformationAsset(connection),
        select: "name staffName informationInventory tag",
      },
      ...sourcePopulation,
    ]);
  };
  // mongoosePaginate(Schema);
  return mongoose.model("risks", Schema);
};
module.exports.Schema = Schema;
