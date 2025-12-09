/**
 * Packages
 */
const mongoose = require("mongoose");
const autoIncreament = require("@riadhossain43/mongoose-autoincrement");
const mongoosePaginate = require("mongoose-paginate-v2");
/**
 * Models
 */
const IamGroup = require("../ourIms/iamGroup");
const UserModel = require("../users&auth/user");
const TagsAndCategories = require("../customisation/tagsAndCategories");
const { groupRef } = require("../../schemaTemplates/references/group.ref");
const { attachment } = require("../../schemaTemplates/attachment");
const {
  getImsMetaInfoForSchema,
} = require("../../utils/getImsMetaInfoForSchema");
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
    name: {
      type: String,
      required: true,
      alias: "Name",
      ...getImsMetaInfoForSchema({
        isClientImportable: true,
      }),
    },
    numberOfLicenses: {
      type: Number,
      default: 0,
      alias: "Number of licenses",
      ...getImsMetaInfoForSchema({
        isClientImportable: true,
      }),
    },
    numberOfInstalls: {
      type: Number,
      default: 0,
      alias: "Number of installs",
      ...getImsMetaInfoForSchema({
        isClientImportable: true,
      }),
    },
    keys: [
      {
        value: {
          type: String,
        },
      },
    ],
    docs: [attachment],
    cost: {
      type: Number,
      default: 0,
      alias: "Cost",
      ...getImsMetaInfoForSchema({
        isClientImportable: true,
      }),
    },
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
  Schema.plugin(autoIncreament.plugin, {
    model: "softwareassets",
    field: "ID",
  });
  Schema.pre("validate", async function (next) {
    this.reference = `SFT-${this.ID}`;
    next();
  });
  Schema.statics.populateAsset = function (asset) {
      return asset
        .populate([
          { path: "group", model: IamGroup(connection), select: "name" },
          {
            path: "created.by",
            model: UserModel(connection),
            select: "name profileImageSrc",
          },
          {
            path: "tagsAndCategories",
            model: TagsAndCategories(connection),
            select: "name",
          },
          {
            path: "docs.modified.by",
            model: UserModel(connection),
            select: "name profileImageSrc",
          },
        ])
         ;
    },
  mongoosePaginate(Schema);
  return mongoose.model("softwareassets", Schema);
};
module.exports.Schema = Schema;
