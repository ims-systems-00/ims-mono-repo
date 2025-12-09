/**
 * Packages
 */
const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
/**
 * Models
 */
const IamGroup = require("../ourIms/iamGroup");
const { orgDataPlugin } = require("../00_plugins/orgDataPlugin");
const Schema = new mongoose.Schema(
  {
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "groups",
      unique: true,
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
  },
  { timestamps: true }
);

module.exports = (connection) => {
  Schema.plugin(orgDataPlugin);
  Schema.statics.populateCQCOverview = function (overview) {
      return overview
        .populate([{ path: "group", model: IamGroup(connection) }])
         ;
    },
  mongoosePaginate(Schema);
  return mongoose.model("cqcoverviews", Schema);
};
module.exports.Schema = Schema;
