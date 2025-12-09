/**
 * Packages
 */
const mongoose = require("mongoose");
const autoIncreament = require("@riadhossain43/mongoose-autoincrement");
const mongoosePaginate = require("mongoose-paginate-v2");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate-v2");
const { USER_TYPE } = require("@ims-systems-00/ims-core/lib/constants");
/**
 * Models
 */
const IamGroup = require("../ourIms/iamGroup");
const { attachment } = require("../../schemaTemplates/attachment");

const Schema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      default: USER_TYPE.INTERNAL,
    },
    lastName: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    emailVerified: {
      status: {
        type: String,
        default: "pending",
        enum: ["pending", "varified"],
      },
      on: {
        type: Date,
        default: null,
      },
    },
    emailVerificationToken: {
      type: String,
      default: null,
    },
    verificationEmailAfter: {
      type: Date,
      default: null,
    },
    isSystemAdmin: {
      type: Boolean,
      default: false,
    },
    badAttempts: {
      type: Number,
      default: 0,
    },
    lockedUntil: {
      type: Date,
      default: null,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      default: "",
    },
    phoneVerified: {
      status: {
        type: String,
        default: "pending",
        enum: ["pending", "varified"],
      },
      on: {
        type: Date,
        default: null,
      },
    },
    phoneOTP: {
      value: {
        type: Number,
        default: null,
      },
      expiredAt: {
        type: Date,
        default: null,
      },
    },
    systemAccess: {
      status: {
        type: String,
        enum: ["Active", "Blocked", "Deactivated"],
        default: "Active",
      },
      period: {
        type: String,
        default: "Full time",
      },
      expires: {
        type: Date,
        default: null,
      },
      updatedOn: {
        type: Date,
        default: null,
      },
    },
    resetToken: {
      type: String,
      default: null,
    },
    systemPassword: {
      status: {
        type: String,
        default: "active",
        enum: ["active", "blocked"],
      },
    },
    accessPolicies: [
      {
        group: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "groups",
        },
      },
    ],
    profileImageInfo: {
      ...attachment,
      SignedUrl: {
        type: String,
      },
    },
    profileImageSrc: {
      type: String,
      default:
        "https://assets.imssystems.tech/images/system/avatar-placeholder.jpg",
    },
    signatureInfo: {
      ...attachment,
    },
    loggedIn: {
      status: String,
      on: Date,
    },
    preferences: {
      darkMode: {
        type: Boolean,
        default: false,
      },
      activeTheme: {
        type: String,
        default: "blue",
      },
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
    refreshTokens: [String],
    created: {
      by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
      on: Date,
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
  Schema.plugin(autoIncreament.plugin, { model: "users", field: "ID" });
  Schema.plugin(mongooseAggregatePaginate);
  Schema.pre("validate", async function (next) {
    this.reference = `USR-${this.ID}`;
    next();
  });
  Schema.statics.populateAll = function (user) {
    return user.populate([
      { path: "accessPolicies.group", model: IamGroup(connection) },
      { path: "created.by", select: "name email profileImageSrc" },
    ]);
  };
  Schema.static.populateUserWithBusinessFunction = function (user) {};
  mongoosePaginate(Schema);
  return mongoose.model("users", Schema);
};
module.exports.Schema = Schema;
