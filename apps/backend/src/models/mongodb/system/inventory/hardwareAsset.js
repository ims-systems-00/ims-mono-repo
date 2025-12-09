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
const TagsAndCategories = require("../customisation/tagsAndCategories");
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
    tag: {
      type: String,
      alias: "Tag",
      ...getImsMetaInfoForSchema({
        isClientImportable: true,
      }),
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      alias: "Owner",
      ...getImsMetaInfoForSchema({
        isClientImportable: true,
        isOwnerShipControler: true,
      }),
    },
    assignedDate: {
      type: Date,
      default: Date.now,
      alias: "Assigned date",
      ...getImsMetaInfoForSchema({
        isClientImportable: true,
      }),
    },
    returnDate: {
      type: Date,
      alias: "Returned date",
      ...getImsMetaInfoForSchema({
        isClientImportable: true,
      }),
    },
    destructionDate: {
      type: Date,
      alias: "Destruction date",
      ...getImsMetaInfoForSchema({
        isClientImportable: true,
      }),
    },
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
  Schema.plugin(orgDataPlugin);
  Schema.plugin(autoIncreament.plugin, {
    model: "hardwareassets",
    field: "ID",
  });
  Schema.pre("validate", async function (next) {
    this.reference = `HD-${this.ID}`;
    next();
  });
  (Schema.statics.populateAsset = function (asset) {
    return asset
      .populate([
        { path: "group", model: IamGroup(connection), select: "name" },
        {
          path: "owner",
          model: User(connection),
          select: "name profileImageSrc",
        },
        {
          path: "tagsAndCategories",
          model: TagsAndCategories(connection),
          select: "name",
        },
        {
          path: "created.by",
          model: User(connection),
          select: "name profileImageSrc",
        },
      ])
       ;
  }),
    mongoosePaginate(Schema);
  return mongoose.model("hardwareassets", Schema);
};
module.exports.Schema = Schema;
