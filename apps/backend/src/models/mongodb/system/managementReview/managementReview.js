/**
 * Packages
 */
const mongoose = require("mongoose");
const autoIncreament = require("@riadhossain43/mongoose-autoincrement");
const mongoosePaginate = require("mongoose-paginate-v2");
/**
 * Models
 */
const CalenderEvents = require("../calender/calenderEvents");
const UserModel = require("../users&auth/user");
const TaskModel = require("../taskManagement/task");
const IamGroupModel = require("../ourIms/iamGroup");
const { attachment } = require("../../schemaTemplates/attachment");
const { sourceDeletePlugin } = require("../00_plugins/sourceDeletePlugin");
const { moduleTypes } = require("../../schemaTemplates/utils/moduleTypes");
const {
  organizationRef,
} = require("../../schemaTemplates/references/organization.ref");
const { orgDataPlugin } = require("../00_plugins/orgDataPlugin");
const Schema = new mongoose.Schema(
  {
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "groups",
      default: null,
    },
    privacy: {
      type: String,
      default: "Organisational",
      enum: ["Organisational", "Business unit"],
    },
    title: String,
    date: Date,
    time: String,
    interval: String,
    attendees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
    ],
    agenda: [attachment],
    minutes: [attachment],
    completed: {
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
    created: {
      on: {
        type: Date,
        default: Date.now,
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
/**
 * Uses a connection to a mongodb database to create a reference to the model to be queried
 * @param {import("mongoose").Connection} connection - The connection to be used based on the tenant
 * @return {import("mongoose").Model} - The worklog model
 */
module.exports = (connection) => {
  autoIncreament.initialize(connection);
  Schema.plugin(autoIncreament.plugin, {
    model: "managementreviews",
    field: "ID",
  });
  Schema.plugin(
    sourceDeletePlugin(moduleTypes.managementreviews, [TaskModel(connection)])
  );
  Schema.plugin(orgDataPlugin);
  Schema.pre("validate", async function (next) {
    this.reference = `MR-${this.ID}`;
    next();
  });
  Schema.post("findOneAndDelete", async function (managementReview) {
    await CalenderEvents(connection).deleteOne({
      systemEventId: managementReview._id,
    });
  });
  (Schema.statics.populateManagementReivew = function (managementReview) {
    return managementReview.populate([
      { path: "group", model: IamGroupModel(connection), select: "name" },
      {
        path: "created.by",
        model: UserModel(connection),
        select: "name profileImageSrc",
      },
      {
        path: "completed.by",
        model: UserModel(connection),
        select: "name profileImageSrc",
      },
      {
        path: "attendees",
        model: UserModel(connection),
        select: "name profileImageSrc",
      },
      {
        path: "agenda.modified.by",
        model: UserModel(connection),
        select: "name profileImageSrc",
      },
      {
        path: "minutes.modified.by",
        model: UserModel(connection),
        select: "name profileImageSrc",
      },
    ]);
  }),
    (Schema.statics.createCalenderEvent = async function (managementReview) {
      let event = await CalenderEvents(connection).findOneAndUpdate(
        { systemEventId: managementReview._id },
        {
          $set: {
            description: `Attendees: ${managementReview.attendees
              .map((attendee) => `${attendee.name} \n`)
              .join("")}`,
          },
        },
        { new: true }
      );
      if (!event) {
        await CalenderEvents(connection).create({
          group: managementReview.group,
          systemEventId: managementReview._id,
          eventReference: "managementreview",
          title: `${managementReview.title} management review`,
          description: `Attendees: \n ${managementReview.attendees
            .map((attendee) => `${attendee.name} \n`)
            .join("")}`,
          attendees: managementReview.attendees.map((attendee) => attendee._id),
          color: "azure",
          start: managementReview.date,
          end: managementReview.date,
          created: {
            on: Date.now(),
            by: managementReview.created.by._id,
          },
        });
      }
    }),
    (Schema.statics.updateCalendetEvent = async function (managementReview) {
      await CalenderEvents(connection).findOneAndUpdate(
        { systemEventId: managementReview._id },
        {
          $set: {
            title: `${managementReview.title} management review`,
            description: `Attendees: \n ${managementReview.attendees
              .map((attendee) => `${attendee.name} \n`)
              .join("")}`,
            attendees: managementReview.attendees.map(
              (attendee) => attendee._id
            ),
            start: managementReview.date,
            end: managementReview.date,
          },
        },
        { new: true }
      );
    }),
    mongoosePaginate(Schema);
  return mongoose.model("managementreviews", Schema);
};
module.exports.Schema = Schema;
