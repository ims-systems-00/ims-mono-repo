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
const { organizationRef } = require("../../schemaTemplates/references/organization.ref");
const { orgDataPlugin } = require("../00_plugins/orgDataPlugin");
const Schema = new mongoose.Schema(
  {
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "groups",
    },
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    telephone: {
      type: Number,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    preferredCommunicationMethod: {
      type: String,
      required: true,
    },
    dateAndTimeOfIncident: {
      type: Date,
      required: true,
    },
    nameOfEmployee: {
      type: String,
    },
    typeOfService: {
      type: String,
      required: true,
    },
    detail: {
      type: String,
      required: true,
    },
    investigator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      default: null,
    },
    investigation: {
      type: String,
      default: "",
    },
    actions: {
      type: String,
      default: "",
    },
    outcome: {
      type: String,
      default: "",
    },
    referredToSomeoneElse: {
      type: Boolean,
      default: false,
    },
    referredInvestigator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      default: null,
    },
    referredActions: {
      type: String,
      default: "",
    },
    referredOutcome: {
      type: String,
      default: "",
    },
    nameOfOrganisation: {
      type: String,
      default: "",
    },
    attachments: [attachment],
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
  autoIncreament.initialize(connection);
  Schema.plugin(orgDataPlugin);
  Schema.plugin(autoIncreament.plugin, { model: "complaints", field: "ID" });
  Schema.pre("validate", async function (next) {
    this.reference = `COM-${this.ID}`;
    next();
  });
  Schema.statics.populateCompliant = function (document) {
      return document
        .populate([
          { path: "group", model: IamGroup(connection), select: "name" },
          {
            path: "investigator",
            model: UserModel(connection),
            select: "name email profileImageSrc",
          },
          {
            path: "referredInvestigator",
            model: UserModel(connection),
            select: "name email profileImageSrc",
          },
          {
            path: "signed.by",
            model: UserModel(connection),
            select: "name email profileImageSrc",
          },
          {
            path: "attachments.modified.by",
            model: UserModel(connection),
            select: "name ",
          },
          {
            path: "created.by",
            model: UserModel(connection),
            select: "name email profileImageSrc",
          },
        ])
         ;
    },
  mongoosePaginate(Schema);
  return mongoose.model("complaints", Schema);
};
module.exports.Schema = Schema;
