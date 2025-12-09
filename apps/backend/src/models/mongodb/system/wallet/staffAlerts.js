/**
 * Packages
 */
const mongoose = require("mongoose");
const autoIncreament = require("@riadhossain43/mongoose-autoincrement");
const mongoosePaginate = require("mongoose-paginate-v2");
/**
 * Models
 */
const User = require("../users&auth/user");
const { orgDataPlugin } = require("../00_plugins/orgDataPlugin");

const Schema = new mongoose.Schema(
  {
    alerted: {
      by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
      on: Date,
    },
    location: String,
    actions: [
      {
        value: {
          type: String,
          default: "",
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
      },
    ],
    resolution: String,
    closed: {
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
  Schema.plugin(orgDataPlugin)
  autoIncreament.initialize(connection);
  Schema.plugin(autoIncreament.plugin, { model: "staffalerts", field: "ID" });
  Schema.pre("validate", async function (next) {
    this.reference = `ALT-${this.ID}`;
    next();
  });
  Schema.pre("validate", async function (next) {
    this.reference = `ALT-${this.ID}`;
    next();
  });
  Schema.statics.populateAlert = function (unit) {
      return unit
        .populate([
          {
            path: "alerted.by",
            model: User(connection),
            select: "name email profileImageSrc",
          },
          {
            path: "actions.created.by",
            model: User(connection),
            select: "name email profileImageSrc",
          },
          {
            path: "closed.by",
            model: User(connection),
            select: "name email profileImageSrc",
          },
        ])
         ;
    },
  mongoosePaginate(Schema);
  return mongoose.model("staffalerts", Schema);
};
module.exports.Schema = Schema;
