const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const {
  softDeletePlugin,
} = require("@ims-systems-00/ims-core/lib/plugins/mongoose/softDelete");
const {
  PARTNERSHIP_PROGRAM_STATUS,
} = require("../../schemaTemplates/references/typesAndEnums");
const UserModel = require("../users&auth/user");
const { orgDataPlugin } = require("../00_plugins/orgDataPlugin");
const Schema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    status: {
      type: String,
      enum: Object.values(PARTNERSHIP_PROGRAM_STATUS),
      default: PARTNERSHIP_PROGRAM_STATUS.PENDING,
    },
    serviceProvision: {
      type: String,
      default: "Not specified",
    },
    customerReach: {
      type: Number,
      default: 0,
    },
    website: {
      type: String,
      default: "Not specified",
    },
    standards: {
      type: String,
      default: "Not specified",
    },
    description: {
      type: String,
      default: "Not specified",
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
  Schema.plugin(mongoosePaginate);
  Schema.plugin(softDeletePlugin);
  Schema.plugin(orgDataPlugin);
  (Schema.statics.populatePartnershipProgram = function (user) {
    return user
      .populate([
        {
          path: "userId",
          model: UserModel(connection),
          select: "name profileImageSrc",
        },
      ])
       ;
  }),
    mongoosePaginate(Schema);
  return mongoose.model("partnership_programs", Schema);
};
module.exports.Schema = Schema;
