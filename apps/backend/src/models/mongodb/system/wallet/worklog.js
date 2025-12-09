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
const { createInfo } = require("../../schemaTemplates/actionLog");

const workState = {
  type: String,
  enum: ["Pause", "Resume"],
};

const Schema = new mongoose.Schema(
  {
    ...createInfo,
    type: {
      type: String,
      required: true,
    },
    startTime: {
      type: Date,
      default: Date.now,
    },
    currentState: workState,
    location: {
      type: String,
    },
    priorities: {
      type: String,
    },
    achievements: {
      type: String,
    },
    timesheet: [
      {
        eventTime: {
          type: Date,
          default: Date.now,
        },
        event: workState,
      },
    ],
    totalBreakTimeMs: {
      type: Number,
      default: 0,
    },
    totalWorkTimeMs: {
      type: Number,
      default: 0,
    },
    endTime: Date,
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
  Schema.plugin(autoIncreament.plugin, { model: "worklogs", field: "ID" });
  Schema.pre("validate", async function (next) {
    this.reference = `WRKLG-${this.ID}`;
    next();
  });
  Schema.statics = {
    populateWorklog: function (worklog) {
      return worklog
        .populate([
          { path: "created.by", model: User(connection), select: "name email profileImageSrc" },
        ])
         ;
    },
  };
  mongoosePaginate(Schema);
  return mongoose.model("worklogs", Schema);
};
module.exports.Schema = Schema;
