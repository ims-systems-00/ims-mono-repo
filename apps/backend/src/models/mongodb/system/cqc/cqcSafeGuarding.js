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
const { attachment } = require("../../schemaTemplates/attachment");
const { orgDataPlugin } = require("../00_plugins/orgDataPlugin");

const Schema = new mongoose.Schema(
  {
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "groups",
    },
    personAffected: {
      type: String,
      required: true,
    },
    riskRegistar: {
      type: String,
      default: "No",
    },
    summaryOfConcerns: {
      type: String,
      default: "",
    },
    agenciesInvolved: {
      type: String,
      default: "",
    },
    investigation: {
      type: String,
      default: "",
    },
    outcome: {
      type: String,
      default: "",
    },
    sharedWith: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
    ],
    attachments: [attachment],
    referred: {
      status: {
        type: Boolean,
        default: false,
      },
      to: {
        type: String,
        default: "",
      },
      email: {
        type: String,
        default: "",
      },
      rational: {
        type: String,
        default: "",
      },
      nameOfOrganisation: {
        type: String,
        default: "",
      },
    },
    signed: {
      status: {
        type: Boolean,
        default: false,
      },
      on: {
        type: Date,
      },
      by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        default: null,
      },
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
    reference: {
      default: "",
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = (connection) => {
  Schema.plugin(orgDataPlugin)
  autoIncreament.initialize(connection);
  Schema.plugin(autoIncreament.plugin, {
    model: "cqcsafeguardings",
    field: "ID",
  });
  Schema.pre("validate", async function (next) {
    this.reference = `SG-${this.ID}`;
    next();
  });
  Schema.statics.populateCQCSafeGuarding = function (document) {
      return document
        .populate([
          { path: "group", model: IamGroup(connection), select: "name " },
          {
            path: "sharedWith",
            model: UserModel(connection),
            select: "name profileImageSrc",
          },
          {
            path: "created.by",
            model: UserModel(connection),
            select: "name email jobTitle profileImageSrc",
          },
          {
            path: "signed.by",
            model: UserModel(connection),
            select: "name email profileImageSrc",
          },
          {
            path: "attachments.modified.by",
            model: UserModel(connection),
            select: "name profileImageSrc",
          },
        ])
         ;
    },
  mongoosePaginate(Schema);
  return mongoose.model("cqcsafeguardings", Schema);
};
module.exports.Schema = Schema;
