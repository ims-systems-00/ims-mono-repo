/**
 * Packages
 */
const mongoose = require("mongoose");
const autoIncreament = require("@riadhossain43/mongoose-autoincrement");
const mongoosePaginate = require("mongoose-paginate-v2");
/**
 * Models
 */
const { namedMetaInfo } = require("../../schemaTemplates/metadata");
const UserModel = require("../users&auth/user");
const IamGroupModel = require("../ourIms/iamGroup");
const {
  softDeletePlugin,
} = require("@ims-systems-00/ims-core/lib/plugins/mongoose/softDelete");
const {
  organizationRef,
} = require("../../schemaTemplates/references/organization.ref");
const { orgDataPlugin } = require("../00_plugins/orgDataPlugin");

function arrayLimit(val) {
  return val.length <= 3;
}


const Schema = new mongoose.Schema(
  {
    ...namedMetaInfo,
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "groups",
    },
    privacy: {
      type: String,
      enum: ["Organisational", "Business unit", "Only me", "Custom"],
    },
    owners: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
    ],
    owners: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
      validate: {
        validator: arrayLimit,
        message: "{PATH} exceeds the limit of 3",
      },
    },
    sharedWith: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
    ],
    reviewInterval: {
      type: String,
      default: "Yearly",
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
  Schema.plugin(autoIncreament.plugin, {
    model: "documentrepositories",
    field: "ID",
  });
  Schema.plugin(softDeletePlugin);
  Schema.plugin(orgDataPlugin);
  Schema.pre("validate", async function (next) {
    this.reference = `REP-${this.ID}`;
    next();
  });
  Schema.static("populateRepository", function (document) {
    return document.populate([
      {
        path: "created.by",
        model: UserModel(connection),
        select: "name profileImageSrc",
      },
      {
        path: "owners",
        model: UserModel(connection),
        select: "name profileImageSrc",
      },
      {
        path: "sharedWith",
        model: UserModel(connection),
        select: "name profileImageSrc",
      },
      { path: "group", model: IamGroupModel(connection), select: "name" },
    ]);
  });
  mongoosePaginate(Schema);
  return mongoose.model("documentrepositories", Schema);
};
module.exports.Schema = Schema;
