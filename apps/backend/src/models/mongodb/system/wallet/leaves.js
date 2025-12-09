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
const CalendarEvent = require("../calender/calenderEvents");
const { metaInfo } = require("../../schemaTemplates/metadata");
const { submission } = require("./schemaTemplates/submission");
const { orgDataPlugin } = require("../00_plugins/orgDataPlugin");

const Schema = new mongoose.Schema(
  {
    ...metaInfo,
    type: {
      type: String,
      required: true,
    },
    days: {
      type: Number,
      required: true,
    },
    startDate: Date,
    startDayFraction: Number,
    endDate: Date,
    endDayFraction: Number,
    country: {
      name: {
        type: String,
      },
      code: {
        type: String,
      },
    },
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
  Schema.plugin(orgDataPlugin)
  Schema.plugin(autoIncreament.plugin, { model: "leaves", field: "ID" });
  const getIdPrefix = (type) => {
    switch (type.toLowerCase()) {
      case "sickness":
      case "sick leave":
        return "SIC";
      default:
        return "AL";
    }
  };
  Schema.pre("validate", async function (next) {
    this.reference = `${getIdPrefix(this.type)}-${this.ID}`;
    next();
  });
  Schema.statics.populateLeave = function (leave) {
      return leave
        .populate([
          {
            path: "created.by",
            model: User(connection),
            select: "name email profileImageSrc",
          },
          {
            path: "submission.lineManagers",
            model: User(connection),
            select: "name email profileImageSrc",
          },
          {
            path: "submission.decisionMaker",
            model: User(connection),
            select: "name email profileImageSrc",
          },
        ])
         ;
    },
    Schema.statics.createCalendarEvent = async function (
      leave,
      { options: { eventVisibilityGroups: groups } }
    ) {
      await CalendarEvent(connection).create({
        groups: groups,
        systemEventId: leave._id,
        eventReference: "leave",
        // Assuming leave was populated before being passed to this function
        title: `${leave.created.by.name} is leaving due to ${leave.type}`,
        description: leave.description,
        start: leave.startDate,
        end: leave.endDate,
        color: "purple",
        attendees: null,
        created: leave.created,
      });
    },
  mongoosePaginate(Schema);
  return mongoose.model("leaves", Schema);
};
module.exports.Schema = Schema;
