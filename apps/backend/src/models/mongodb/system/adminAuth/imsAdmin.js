const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const {
  softDeletePlugin,
} = require("@ims-systems-00/ims-core/lib/plugins/mongoose/softDelete");
const { attachment } = require("../../schemaTemplates/attachment");
const { VERIFICATION_STATUS, ADMIN_ROLES } = require("../../schemaTemplates/references/typesAndEnums");
const Schema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
    },
    industry: {
      type: String,
    },
    jobTitle: {
      type: String,
      default: "",
    },
    password: {
      type: String,
      required: true,
    },
    profileImageInfo: {
      ...attachment,
      SignedUrl: {
        type: String,
      },
    },
    purposeOfUse: {
      type: [String],
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: Object.values(ADMIN_ROLES),
    },
    emailVerification: {
      token: {
        type: String,
        default: "",
      },
      status: {
        type: String,
        enum: Object.values(VERIFICATION_STATUS),
        default: VERIFICATION_STATUS.PENDING,
      },
      verificationDate: {
        type: Date,
        default: null,
      },
    },
    adminRefreshTokens: [String],
    recoveryToken: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);
Schema.plugin(softDeletePlugin);
Schema.plugin(mongoosePaginate);
/**
 * Uses a connection to a mongodb database to create a reference to the model to be queried
 * @param {import("mongoose").Connection} connection - The connection to be used based on the tenant
 * @return {import("mongoose").Model} - The worklog model
 */
module.exports = (connection) => {
  Schema.plugin(softDeletePlugin);
  mongoosePaginate(Schema);
  // Middleware to set fullName before saving
  Schema.pre("validate", function (next) {
    this.fullName = `${this.firstName} ${this.lastName}`;
    next();
  });
  return mongoose.model("ims_admins", Schema);
};
module.exports.Schema = Schema;
