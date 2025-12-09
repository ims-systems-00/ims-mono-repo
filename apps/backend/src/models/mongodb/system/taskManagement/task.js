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
const IamGroup = require("../ourIms/iamGroup");
const CalenderEvents = require("../calender/calenderEvents");
const { nudgeMetaData } = require("../../schemaTemplates/nudgeMetadata");
const { attachment } = require("../../schemaTemplates/attachment");
const { moduleTypes } = require("../../schemaTemplates/utils/moduleTypes");
const { sourceLinkPlugin } = require("../00_plugins/sourceLinkPlugin");
const {
  organizationRef,
} = require("../../schemaTemplates/references/organization.ref");
const { orgDataPlugin } = require("../00_plugins/orgDataPlugin");

const Schema = new mongoose.Schema(
  {
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "groups",
    },
    created: {
      by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
      },
      on: {
        type: Date,
        default: Date.now,
      },
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    attachments: [attachment],
    teamPriority: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: String,
      enum: ["High", "Medium", "Low"],
      default: "Medium",
    },
    assignedTo: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "users",
        },
        acceptance: {
          type: String,
          default: "Pending",
          enum: ["Pending", "Accepted", "Declined"],
        },
        updatedOn: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    completed: {
      status: {
        type: String,
        default: "Pending",
        enum: ["Pending", "In progress", "Complete"],
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
    due: {
      type: Date,
      required: true,
    },
    reference: {
      default: "",
      type: String,
    },
    ...nudgeMetaData,
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
  Schema.plugin(autoIncreament.plugin, { model: "tasks", field: "ID" });
  Schema.plugin(
    sourceLinkPlugin([
      moduleTypes.tasks,
      moduleTypes.risks,
      moduleTypes.incidents,
      moduleTypes.audits,
      moduleTypes.cips,
      moduleTypes.customers,
      moduleTypes.documenttrees,
      moduleTypes.expensereports,
      moduleTypes.managementreviews,
      moduleTypes.kpiobjectives,
      moduleTypes.suppliers,
    ])
  );
  Schema.plugin(orgDataPlugin);
  Schema.post("findOneAndDelete", async function (task) {
    await CalenderEvents(connection).deleteOne({ systemEventId: task._id });
  });
  Schema.pre("validate", async function (next) {
    this.reference = `TSK-${this.ID}`;
    next();
  });
  Schema.statics.bulkPopulateTask = function (task) {
    return task
      .populate([
        {
          path: "created.by",
          model: UserModel(connection),
          select: "name profileImageSrc",
        },
        {
          path: "assignedTo",
          model: UserModel(connection),
          select: "name profileImageSrc",
        },
        { path: "group", model: IamGroup(connection), select: "name" },
        {
          path: "completed.by",
          model: UserModel(connection),
          select: "name profileImageSrc",
        },
      ])
       ;
  };
  Schema.statics.bulkPopulateTask = function (task) {
    return task
      .populate([
        {
          path: "created.by",
          model: UserModel(connection),
          select: "name profileImageSrc",
        },
        {
          path: "assignedTo",
          model: UserModel(connection),
          select: "name profileImageSrc",
        },
        { path: "group", model: IamGroup(connection), select: "name" },
        {
          path: "completed.by",
          model: UserModel(connection),
          select: "name profileImageSrc",
        },
      ])
       ;
  };
  Schema.statics.populateTask = function (task) {
    let population = task?.source?.moduleType
      ? [
          {
            path: "source.module",
            model: mongoose.model(task?.source?.moduleType),
          },
        ]
      : [];
    return task
      .populate([
        {
          path: "created.by",
          model: UserModel(connection),
          select: "name profileImageSrc",
        },
        {
          path: "assignedTo.user",
          model: UserModel(connection),
          select: "name",
        },
        { path: "group", model: IamGroup(connection), select: "name" },
        {
          path: "completed.by",
          model: UserModel(connection),
          select: "name profileImageSrc",
        },
        {
          path: "attachments.modified.by",
          model: UserModel(connection),
          select: "name profileImageSrc",
        },
        ...population,
      ])
       ;
  };
  Schema.statics.createCalenderEvent = async function (task) {
    await CalenderEvents(connection).create({
      group: task.group && task.group._id,
      systemEventId: task._id,
      eventReference: "task",
      title: `${task.name} (Task manager)`,
      description: task.description,
      color: "default",
      start: task.due,
      end: task.due,
      attendees: task.assignedTo,
      created: {
        on: Date.now(),
        by: task.created.by,
      },
    });
  };
  Schema.statics.updateCalenderEvent = async function (task) {
    await CalenderEvents(connection).findOneAndUpdate(
      { systemEventId: task._id },
      {
        $set: {
          title: `${task.name} (Task manager)`,
          description: task.description,
          start: task.due,
          attendees: task.assignedTo,
          end: task.due,
        },
      },
      { new: true }
    );
  };
  mongoosePaginate(Schema);
  return mongoose.model("tasks", Schema);
};
module.exports.Schema = Schema;
