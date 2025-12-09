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
const User = require("../users&auth/user");
const { groupRef } = require("../../schemaTemplates/references/group.ref");
const {
  getImsMetaInfoForSchema,
} = require("../../utils/getImsMetaInfoForSchema");
const {
  organizationRef,
} = require("../../schemaTemplates/references/organization.ref");
const { orgDataPlugin } = require("../00_plugins/orgDataPlugin");
const TagsAndCategories = require("../customisation/tagsAndCategories");
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
    role: {
      type: String,
      required: true,
      alias: "Role",
      ...getImsMetaInfoForSchema({
        isClientImportable: true,
      }),
    },
    responsibility: {
      type: String,
      alias: "Responsibility",
      ...getImsMetaInfoForSchema({
        isClientImportable: true,
      }),
    },
    skill: {
      type: String,
      required: true,
      alias: "Skill",
      ...getImsMetaInfoForSchema({
        isClientImportable: true,
      }),
    },
    created: {
      by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        default: null,
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
  Schema.plugin(orgDataPlugin)
  Schema.plugin(autoIncreament.plugin, { model: "peopleassets", field: "ID" });
  Schema.pre("validate", async function (next) {
    this.reference = `PPL-${this.ID}`;
    next();
  });
  Schema.statics.populateAsset =  function (asset) {
      return asset
        .populate([
          { path: "group", model: IamGroup(connection), select: "name" },
          {
            path: "created.by",
            model: User(connection),
            select: "name profileImageSrc",
          },
          {
            path: "tagsAndCategories",
            model: TagsAndCategories(connection),
            select: "name",
          },
        ])
         ;
    },
  mongoosePaginate(Schema);
  return mongoose.model("peopleassets", Schema);
};
module.exports.Schema = Schema;
