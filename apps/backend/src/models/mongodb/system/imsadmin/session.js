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

module.exports = (connection) => {
  Schema.statics = {};
  mongoosePaginate(Schema);
  return mongoose.model("session", Schema);
};
module.exports.Schema = Schema;
