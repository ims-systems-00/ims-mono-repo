/**
 * Packages
 */
const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
/**
 * Models
 */

const Schema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    current: {
      group: {
        type: mongoose.Schema.Types.ObjectId,
      },
      role: {
        type: mongoose.Schema.Types.ObjectId,
      },
    },
    userAgent: {
      type: String,
      default: "",
    },
    valid: {
      type: Boolean,
      default: true,
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
  Schema.statics = {};
  mongoosePaginate(Schema);
  return mongoose.model("sessions", Schema);
};
module.exports.Schema = Schema;
