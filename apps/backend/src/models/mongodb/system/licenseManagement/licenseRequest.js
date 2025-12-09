/**
 * Packages
 */
const mongoose = require("mongoose");
const autoIncreament = require("@riadhossain43/mongoose-autoincrement");
const {
  IMS_POLICIES,
  IMS_SERVICES,
} = require("@ims-systems-00/ims-core/lib/constants");
const mongoosePaginate = require("mongoose-paginate-v2");
/**
 * Models
 */
const NotificationModel = require("../notification/notification");
const AdminModel = require("../adminAuth/imsAdmin");
const UserModel = require("../users&auth/user");
const OrganisationModel = require("../organization/organization");
const IamRoleModel = require("../ourIms/iamRole");
const { orgDataPlugin } = require("../00_plugins/orgDataPlugin");
const Schema = new mongoose.Schema(
  {
    groups: {
      type: Number,
      default: 0,
    },
    users: {
      type: Number,
      default: 0,
    },
    superUser: {
      type: Number,
      default: 0,
    },
    carbocalc: {
      type: Boolean,
      default: false,
    },
    imsforms: {
      type: Boolean,
      default: false,
    },
    projectims: {
      type: Boolean,
      default: false,
    },
    complianceTools: {
      type: [String],
      enum: [
        IMS_SERVICES.DSPTNHS,
        IMS_SERVICES.ISO27001,
        IMS_SERVICES.ISO27001_2022,
        IMS_SERVICES.ISO27001_2022_ANNEX_A,
        IMS_SERVICES.ISO27002,
        IMS_SERVICES.ISO9001,
        IMS_SERVICES.ISO45001,
        IMS_SERVICES.ISO20000,
        IMS_SERVICES.ISO14001,
        IMS_SERVICES.BS9997,
        IMS_SERVICES.CQC,
        IMS_SERVICES.ISO15686_5,
        IMS_SERVICES.ESG_ENVIRONMENTAL,
        IMS_SERVICES.ESG_GOVERNANCE,
        IMS_SERVICES.ESG_SOCIAL,
        IMS_SERVICES.BUILDING_SAFETY_ACT,
      ],
      default: [],
    },
    additionalModules: {
      type: [String],
      enum: [IMS_SERVICES.CRM],
      default: [],
    },
    message: {
      type: String,
    },
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
    granted: {
      status: {
        type: String,
        enum: ["Pending", "Granted", "Canceled"],
        default: "Pending",
      },
      by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ims_admins",
        default: null,
      },
      on: {
        type: Date,
        default: Date.now,
        default: null,
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
  Schema.plugin(orgDataPlugin);
  Schema.plugin(autoIncreament.plugin, {
    model: "licenserequests",
    field: "ID",
  });
  Schema.pre("validate", async function (next) {
    this.reference = `LR-${this.ID}`;
    next();
  });
  Schema.statics.populateLicenseRequest = function (kpiobjective) {
    return kpiobjective.populate([
      {
        path: "organization",
        model: OrganisationModel(connection),
        select: "name email",
      },
      {
        path: "created.by",
        model: UserModel(connection),
        select: "name email profileImageSrc",
      },
      {
        path: "granted.by",
        model: AdminModel(connection),
        select: "name email profileImageSrc",
      },
    ]);
  };
  mongoosePaginate(Schema);
  return mongoose.model("licenserequests", Schema);
};
module.exports.Schema = Schema;
