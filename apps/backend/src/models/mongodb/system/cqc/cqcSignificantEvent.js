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
    dateOfEvent: {
      type: Date,
      required: true,
    },
    title: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    dateOfReviewMeeting: {
      type: Date,
      required: true,
    },
    presentPersonnel: String,
    attachments: [attachment],
    positivePoints: {
      type: String,
      default: "",
    },
    planOfActions: [
      {
        value: String,
        assigned: {
          to: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
          },
          on: {
            type: Date,
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
      },
    ],
    keyIssues: {
      type: String,
      default: "",
    },
    areasOfConcern: {
      type: String,
      default: "",
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
  autoIncreament.initialize(connection);
  Schema.plugin(orgDataPlugin)
  Schema.plugin(autoIncreament.plugin, {
    model: "cqcsignificantevents",
    field: "ID",
  });
  Schema.pre("validate", async function (next) {
    this.reference = `SE-${this.ID}`;
    next();
  });
  Schema.statics.populateCQCSignificantEvent = function (document) {
      return document
        .populate([
          { path: "group", model: IamGroup(connection), select: "name " },
          {
            path: "planOfActions.assigned.to",
            model: UserModel(connection),
            select: "name email profileImageSrc",
          },
          {
            path: "planOfActions.created.by",
            model: UserModel(connection),
            select: "name email profileImageSrc",
          },
          {
            path: "created.by",
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
            select: "name profileImageSrc",
          },
        ])
         ;
  };
  mongoosePaginate(Schema);
  return mongoose.model("cqcsignificantevents", Schema);
};
module.exports.Schema = Schema;
