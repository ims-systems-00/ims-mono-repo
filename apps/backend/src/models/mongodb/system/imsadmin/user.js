/**
 * Packages
 */
const mongoose = require("mongoose");
const autoIncreament = require("@riadhossain43/mongoose-autoincrement");
const mongoosePaginate = require("mongoose-paginate-v2");
/**
 * Models
 */

const Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    lastLogin: Date,
    role: {
      type: String,
      enum: ["Admin", "Moderator", "Basic"],
      default: "Basic",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = (connection) => {
  Schema.statics = {};
  mongoosePaginate(Schema);
  return mongoose.model("user", Schema);
};
module.exports.Schema = Schema;
