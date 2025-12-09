const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const {
  softDeletePlugin,
} = require("@ims-systems-00/ims-core/lib/plugins/mongoose/softDelete");
const { orgDataPlugin } = require("../00_plugins/orgDataPlugin");
const {
  ROLES,
  WORK_LOCATION_TYPE,
} = require("../../schemaTemplates/references/typesAndEnums");

const Schema = new mongoose.Schema(
  {
    invitedUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    role: {
      type: String,
      enum: Object.values(ROLES),
      required: true,
    },
    workLocationType: {
      type: String,
      enum: Object.values(WORK_LOCATION_TYPE),
      default: WORK_LOCATION_TYPE.ON_SITE,
    },
    jobTitle: {
      type: String,
      default: "Not set",
    },
    salary: {
      type: Number,
      default: 0,
    },
    leaveDaysEntitledTo: {
      type: Number,
      default: 0,
    },
    workLocations: [
      {
        type: {
          type: String,
        },
        address: {
          type: String,
        },
      },
    ],
    lineManagers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
    ],
    workShift: {
      status: {
        type: String,
        enum: ["Clocked in", "Paused", "Clocked out"],
        default: "Clocked out",
      },
      /**
       * Start and end times are counted as below
       * Numbers represent the milliseconds since 00:00:00
       */
      weeklyHours: {
        type: [
          {
            startTime: {
              type: Number,
              default: -1,
            },
            endTime: {
              type: Number,
              default: -1,
            },
          },
        ],
        validate: [(value) => value.length <= 7, "{PATH} exceeds limit of 7"],
      },
      timeZone: String,
    },
    country: {
      name: {
        type: String,
        default: "United Kingdom",
      },
      code: {
        type: String,
        default: "GB",
      },
    },
    toilBalance: {
      // Time Off In Lieu Balance
      type: Number,
      default: 0,
    },
    medicalInfo: {
      allergies: [{ type: String }],
      blood: {
        group: {
          type: String,
          enum: ["A", "B", "AB", "O"],
        },
        rhd: {
          type: String,
          enum: ["+", "-"],
        },
      },
      conditions: [String],
      organDonorStatus: Boolean,
      insurance: String,
      emergencyContact: [
        {
          name: String,
          phone: String,
          relation: String,
        },
      ],
    },
    groups: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "groups",
        },
      ],
      default: [],
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
  Schema.plugin(softDeletePlugin);
  Schema.plugin(mongoosePaginate);
  Schema.plugin(orgDataPlugin);
  mongoosePaginate(Schema);
  return mongoose.model("memberships", Schema);
};
module.exports.Schema = Schema;
