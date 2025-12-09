// Packages
const mongoose = require("mongoose");
const autoIncreament = require("@riadhossain43/mongoose-autoincrement");
const mongoosePaginate = require("mongoose-paginate-v2");
const { IMS_POLICIES } = require("@ims-systems-00/ims-core/lib/constants");

// Models
const UserModel = require("../users&auth/user");
const CalenderEvents = require("../calender/calenderEvents");
const IamGroupModel = require("../ourIms/iamGroup");
const TaskModel = require("../taskManagement/task");
const { attachment } = require("../../schemaTemplates/attachment");
const { complianceLinkPlugin } = require("../00_plugins/complianceLinkPlugin");
const { sourceDeletePlugin } = require("../00_plugins/sourceDeletePlugin");
const { moduleTypes } = require("../../schemaTemplates/utils/moduleTypes");
const {
  organizationRef,
} = require("../../schemaTemplates/references/organization.ref");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");
const { orgDataPlugin } = require("../00_plugins/orgDataPlugin");
const Schema = new mongoose.Schema(
  {
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "groups",
    },
    complianceBody: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "groups",
    },
    title: {
      type: String,
    },
    focusArea: {
      type: String,
    },
    auditor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    comment: {
      type: String,
      default: "",
    },
    risks: [
      {
        title: {
          type: String,
        },
        description: {
          type: String,
        },
        score: {
          likelihood: {
            type: Number,
            default: 1,
          },
          consequence: {
            type: Number,
            default: 1,
          },
          total: {
            type: Number,
            default: 1,
          },
        },
      },
    ],
    cips: [
      {
        title: {
          type: String,
        },
        opportunityForImprovement: {
          type: String,
        },
      },
    ],
    identifications: [
      {
        nonConformity: { type: String },
        rootCause: { type: String },
      },
    ],
    startDate: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    attachments: [attachment],
    type: {
      type: String,
      enum: ["Internal", "External"],
    },
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
    interval: {
      type: String,
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
  Schema.plugin(autoIncreament.plugin, { model: "audits", field: "ID" });
  Schema.plugin(
    sourceDeletePlugin(moduleTypes.audits, [TaskModel(connection)])
  );
  Schema.plugin(orgDataPlugin);
  Schema.plugin(complianceLinkPlugin);
  Schema.pre("validate", async function (next) {
    this.reference = `AUD-${this.ID}`;
    next();
  });
  (Schema.statics.populateAudit = function (audit) {
    return audit.populate([
      {
        path: "complianceBody",
        model: IamGroupModel(connection),
        select: "name",
      },
      { path: "group", model: IamGroupModel(connection), select: "name" },
      {
        path: "auditor",
        model: UserModel(connection),
        select: "name profileImageSrc",
      },
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
        path: "attachments.modified.by",
        model: UserModel(connection),
        select: "name profileImageSrc",
      },
    ]);
  }),
    (Schema.statics.createCalenderEvent = async function (audit) {
      let isThere = await CalenderEvents(connection).findOne({
        systemEventId: audit._id,
      });
      if (!isThere) {
        let groups = await IamGroupModel(connection).find({
          $or: [
            { _id: { $in: [audit.group._id, audit.complianceBody._id] } },
            { name: IMS_POLICIES.IMS_SYSTEM_ADMINISTRATION },
          ],
        });
        let auditor = await UserModel(connection).findOne({
          _id: audit.auditor._id,
        });
        let attendees = await UserModel(connection).find({
          "accessPolicies.group": { $in: groups.map((group) => group._id) },
        });
        await CalenderEvents(connection).create({
          group: audit.group,
          systemEventId: audit._id,
          eventReference: "audit",
          title: `${audit.title} ${audit.type.toLowerCase()} audit (${
            audit.group.name
          })`,
          description: `Certification body\n${audit.complianceBody.name}\nScheduled time\n${audit.time}\nAuditor : ${auditor.name}`,
          color: "green",
          start: audit.startDate,
          end: audit.startDate,
          attendees: attendees.map((attendee) => attendee._id),
          created: {
            on: Date.now(),
            by: audit.created.by._id,
          },
        });
      }
    }),
    (Schema.statics.updateCalenderEvent = async function (audit) {
      try {
        let auditor = await UserModel(connection).findOne({
          _id: audit.auditor,
        });
        await CalenderEvents(connection).findOneAndUpdate(
          { systemEventId: audit._id },
          {
            $set: {
              title: `${audit.title} ${audit.type.toLowerCase()} audit (${
                audit.group.name
              })`,
              description: `Certification body\n${audit.complianceBody.name}\nScheduled time\n${audit.time}\nAuditor : ${auditor.name}`,
              start: audit.startDate,
              end: audit.startDate,
            },
          }
        );
      } catch (err) {
        logger.info(err);
      }
    }),
    mongoosePaginate(Schema);
  Schema.post("findOneAndDelete", async function (audit) {
    await CalenderEvents(connection).deleteOne({ systemEventId: audit._id });
  });
  return mongoose.model("audits", Schema);
};
module.exports.Schema = Schema;
