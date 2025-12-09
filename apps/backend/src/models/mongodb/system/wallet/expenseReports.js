/**
 * Packages
 */
const mongoose = require("mongoose");
const autoIncreament = require("@riadhossain43/mongoose-autoincrement");
const mongoosePaginate = require("mongoose-paginate-v2");
/**
 * Models
 */
const UserModel = require("../users&auth/user");
const TaskModel = require("../taskManagement/task");
const { attachment } = require("../../schemaTemplates/attachment");
const { submission } = require("./schemaTemplates/submission");
const { titledMetaInfo } = require("../../schemaTemplates/metadata");
const { sourceDeletePlugin } = require("../00_plugins/sourceDeletePlugin");
const { moduleTypes } = require("../../schemaTemplates/utils/moduleTypes");
const { orgDataPlugin } = require("../00_plugins/orgDataPlugin");

const notes = {
  type: String,
};

const cost = {
  type: Number,
  default: 0,
};

const description = {
  type: String,
  required: true,
};
const expense = {
  type: {
    type: String,
    required: true,
  },
  cost,
  description,
  attachments: [attachment],
};

const travel = {
  type: {
    type: String,
    enum: ["One way", "Round trip"],
  },
  transport: {
    type: String,
    enum: ["Car", "Air", "Public transport"],
  },
  from: String,
  to: String,
  distance: {
    type: Number,
    default: 0,
  },
  cost,
  notes,
  attachments: [attachment],
};

const accommodation = {
  notes,
  location: String,
  type: {
    type: String,
  },
  checkin: Date,
  checkout: Date,
  cost,
  attachments: [attachment],
};

const Schema = new mongoose.Schema(
  {
    ...titledMetaInfo,
    currency: {
      type: String,
      defalt: "£",
    },
    expenses: [expense],
    travels: [travel],
    accommodations: [accommodation],
    submission,
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
    model: "expensereports",
    field: "ID",
  });
  Schema.plugin(
    sourceDeletePlugin(moduleTypes.expensereports, [TaskModel(connection)])
  );
  Schema.pre("validate", async function (next) {
    this.reference = `EXPR-${this.ID}`;
    next();
  });
  Schema.plugin(orgDataPlugin)
  Schema.statics.populateExpenseReport = function (user) {
      return user
        .populate([
          {
            path: "created.by",
            model: UserModel(connection),
            select: "name email profileImageSrc",
          },
          {
            path: "expenses.attachments.modified.by",
            model: UserModel(connection),
            select: "name profileImageSrc",
          },
          {
            path: "travels.attachments.modified.by",
            model: UserModel(connection),
            select: "name profileImageSrc",
          },
          {
            path: "accommodations.attachments.modified.by",
            model: UserModel(connection),
            select: "name profileImageSrc",
          },
          {
            path: "submission.lineManagers",
            model: UserModel(connection),
            select: "name email profileImageSrc",
          },
          {
            path: "submission.decisionMaker",
            model: UserModel(connection),
            select: "name email profileImageSrc",
          },
        ])
         ;
    },
  mongoosePaginate(Schema);
  return mongoose.model("expensereports", Schema);
};
module.exports.Schema = Schema;
