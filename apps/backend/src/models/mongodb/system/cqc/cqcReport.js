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
    personName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      default: "",
    },
    safe: {
      rating: {
        type: String,
        enum: [
          "Not rated",
          "Inadequate",
          "Requires improvement",
          "Good",
          "Outstanding",
        ],
        default: "Not rated",
      },
      compliancePercentage: {
        type: Number,
        default: 0,
      },
    },
    effective: {
      rating: {
        type: String,
        enum: [
          "Not rated",
          "Inadequate",
          "Requires improvement",
          "Good",
          "Outstanding",
        ],
        default: "Not rated",
      },
      compliancePercentage: {
        type: Number,
        default: 0,
      },
    },
    caring: {
      rating: {
        type: String,
        enum: [
          "Not rated",
          "Inadequate",
          "Requires improvement",
          "Good",
          "Outstanding",
        ],
        default: "Not rated",
      },
      compliancePercentage: {
        type: Number,
        default: 0,
      },
    },
    responsive: {
      rating: {
        type: String,
        enum: [
          "Not rated",
          "Inadequate",
          "Requires improvement",
          "Good",
          "Outstanding",
        ],
        default: "Not rated",
      },
      compliancePercentage: {
        type: Number,
        default: 0,
      },
    },
    wellLed: {
      rating: {
        type: String,
        enum: [
          "Not rated",
          "Inadequate",
          "Requires improvement",
          "Good",
          "Outstanding",
        ],
        default: "Not rated",
      },
      compliancePercentage: {
        type: Number,
        default: 0,
      },
    },
    overall: {
      rating: {
        type: String,
        enum: [
          "Not rated",
          "Inadequate",
          "Requires improvement",
          "Good",
          "Outstanding",
        ],
        default: "Not rated",
      },
      compliancePercentage: {
        type: Number,
        default: 0,
      },
    },
    complaints: {
      open: {
        type: Number,
        default: 0,
      },
      signedOff: {
        type: Number,
        default: 0,
      },
    },
    whistleBlows: {
      open: {
        type: Number,
        default: 0,
      },
      signedOff: {
        type: Number,
        default: 0,
      },
    },
    significantEvents: {
      open: {
        type: Number,
        default: 0,
      },
      signedOff: {
        type: Number,
        default: 0,
      },
    },
    safeGuardings: {
      open: {
        type: Number,
        default: 0,
      },
      signedOff: {
        type: Number,
        default: 0,
      },
    },
    attachments: [attachment],
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
  Schema.plugin(autoIncreament.plugin, { model: "cqcreports", field: "ID" });
  Schema.pre("validate", async function (next) {
    this.reference = `CQCRP-${this.ID}`;
    next();
  });
  Schema.statics = {
    populateCQCReport: function (document) {
      return document
        .populate([
          { path: "group", model: IamGroup(connection), select: "name" },
          {
            path: "created.by",
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
  };
  mongoosePaginate(Schema);
  return mongoose.model("cqcreports", Schema);
};
module.exports.Schema = Schema;
