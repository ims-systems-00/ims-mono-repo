/**
 * Packages
 */
const mongoose = require("mongoose");
const autoIncreament = require("@riadhossain43/mongoose-autoincrement");
const {
  IMS_POLICIES,
} = require("@ims-systems-00/ims-core/lib/constants");
const mongoosePaginate = require("mongoose-paginate-v2");
/**
 * Models
 */
const UserModel = require("../users&auth/user");
const TagsAndCategories = require("../customisation/tagsAndCategories");
const TaskModel = require("../taskManagement/task");
const CalenderEvents = require("../calender/calenderEvents");
const IamGroupModel = require("../ourIms/iamGroup");
const { nudgeMetaData } = require("../../schemaTemplates/nudgeMetadata");
const sourceTemplateBase = require("../../schemaTemplates/source");
const sourceTemplate = { ...sourceTemplateBase };
sourceTemplate.source.moduleType.default = "incidents";
const { groupRef } = require("../../schemaTemplates/references/group.ref");
const { attachment } = require("../../schemaTemplates/attachment");

const {
  getImsMetaInfoForSchema,
} = require("../../utils/getImsMetaInfoForSchema");
const { complianceLinkPlugin } = require("../00_plugins/complianceLinkPlugin");
const { sourceDeletePlugin } = require("../00_plugins/sourceDeletePlugin");
const { moduleTypes } = require("../../schemaTemplates/utils/moduleTypes");
const { orgDataPlugin } = require("../00_plugins/orgDataPlugin");

const Schema = new mongoose.Schema(
  {
    group: {
      ...groupRef,
    },
    tagsAndCategories: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tagsAndCategories",
    },
    title: {
      type: String,
      required: true,
      alias: "Incident title",
      ...getImsMetaInfoForSchema({
        isClientImportable: true,
      }),
    },
    description: {
      type: String,
      alias: "Description",
      ...getImsMetaInfoForSchema({
        isClientImportable: true,
      }),
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      default: null,
      alias: "Incident owner",
      ...getImsMetaInfoForSchema({
        isClientImportable: true,
        isOwnerShipControler: true,
      }),
    },
    methodOfNotification: {
      type: String,
      default: "",
      alias: "Method of notification",
      ...getImsMetaInfoForSchema({
        isClientImportable: true,
      }),
    },
    affectedService: {
      type: String,
      default: "",
      alias: "Affected service",
      ...getImsMetaInfoForSchema({
        isClientImportable: true,
      }),
    },
    privacy: {
      type: String,
      enum: ["Organisational", "Business unit"],
      default: "Business unit",
      alias: "Type",
    },
    ...sourceTemplate,
    created: {
      by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
      on: {
        type: Date,
        default: Date.now,
      },
    },
    attachments: [attachment],
    escalated: {
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
    resolved: {
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
    resolution: {
      type: String,
      default: "",
      alias: "Resolution",
      ...getImsMetaInfoForSchema({
        isClientImportable: true,
      }),
    },
    resolutionTime: {
      type: Number,
      default: 0,
    },
    priority: {
      type: String,
      enum: ["P1", "P2", "P3", "P4"],
      default: "P3",
      alias: "Priority",
      ...getImsMetaInfoForSchema({
        isClientImportable: true,
      }),
    },
    updated: {
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
  Schema.plugin(autoIncreament.plugin, { model: "incidents", field: "ID" });
  Schema.plugin(complianceLinkPlugin);
  Schema.plugin(orgDataPlugin);
  Schema.plugin(
    sourceDeletePlugin(moduleTypes.incidents, [TaskModel(connection)])
  );
  Schema.pre("validate", async function (next) {
    this.reference = `INC-${this.ID}`;
    next();
  });
  Schema.post("findOneAndDelete", async function (incident) {
    await CalenderEvents(connection).deleteOne({ systemEventId: incident._id });
  });
  Schema.statics.updateCalenderEvent = async function (incident) {
    try {
      await CalenderEvents(connection).findOneAndUpdate(
        { systemEventId: incident._id },
        {
          $set: {
            title: incident.title,
            description: incident.description,
          },
        }
      );
    } catch (err) {
      console.log(err);
    }
  };
  Schema.statics.createCalenderEvent = async function (incident) {
    if (incident.priority === "P1") {
      let groups = await IamGroupModel(connection).find({
        $or: [
          { _id: incident.group._id },
          { name: IMS_POLICIES.IMS_SYSTEM_ADMINISTRATION },
        ],
      });
      let attendees = await UserModel(connection).find({
        "accessPolicies.group": { $in: groups.map((group) => group._id) },
      });
      await CalenderEvents(connection).create({
        group: incident.group._id,
        systemEventId: incident._id,
        eventReference: "incident",
        title: `${incident.title} (${incident.group.name} p1 incident)`,
        description: incident.description,
        start: incident.created.on,
        end: incident.created.on,
        color: "red",
        attendees: attendees.map((attendee) => attendee._id),
        created: {
          on: Date.now(),
          by: incident.created.by._id,
        },
      });
    }
  };
  Schema.statics.populateIncident = function (incident) {
    let sourcePopulation = incident?.source?.moduleType
      ? [
          {
            path: "source.module",
            model: mongoose.model(incident?.source?.moduleType),
          },
        ]
      : [];
    return incident
      .populate([
        { path: "group", modle: IamGroupModel(connection), select: "name" },
        {
          path: "owner",
          modle: UserModel(connection),
          select: "name email profileImageSrc",
        },
        {
          path: "tagsAndCategories",
          model: TagsAndCategories(connection),
          select: "name",
        },
        {
          path: "created.by",
          modle: UserModel(connection),
          select: "name profileImageSrc",
        },
        {
          path: "updated.by",
          modle: UserModel(connection),
          select: "name profileImageSrc",
        },
        {
          path: "resolved.by",
          modle: UserModel(connection),
          select: "name profileImageSrc",
        },
        {
          path: "attachments.modified.by",
          model: UserModel(connection),
          select: "name profileImageSrc",
        },
        {
          path: "escalated.by",
          modle: UserModel(connection),
          select: "name profileImageSrc",
        },
        ...sourcePopulation,
      ])
       ;
  };
  mongoosePaginate(Schema);
  return mongoose.model("incidents", Schema);
};
module.exports.Schema = Schema;
