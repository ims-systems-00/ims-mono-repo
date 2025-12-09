// Packages
const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

// Models
const IamGroup = require("../ourIms/iamGroup");
const User = require("../users&auth/user");
const {
  organizationRef,
} = require("../../schemaTemplates/references/organization.ref");
const { orgDataPlugin } = require("../00_plugins/orgDataPlugin");
const Schema = new mongoose.Schema(
  {
    groups: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "groups",
        default: null,
      },
    ],
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    tags: [String],
    systemEventId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "eventReference",
      default: null,
    },
    eventReference: {
      type: String,
      enum: [
        "supplier",
        "managementreview",
        "audit",
        "incident",
        "task",
        "leave",
      ],
    },
    color: { type: String },
    start: { type: Date },
    end: { type: Date },
    attendees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
    ],
    created: {
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
 * @return {import("mongoose").Model} - The calendar events model
 */
module.exports = (connection) => {
  Schema.plugin(orgDataPlugin);
  Schema.statics.populateCalenderEvent = function (calenderEvent) {
      return calenderEvent
        .populate([
          { path: "groups", model: IamGroup(connection), select: "name" },
          {
            path: "attendees",
            model: User(connection),
            select: "name email profileImageSrc",
          },
          {
            path: "created.by",
            model: User(connection),
            select: "name email profileImageSrc",
          },
        ])
         ;
    },
  mongoosePaginate(Schema);
  return mongoose.model("calenderevents", Schema);
};
module.exports.Schema = Schema;
