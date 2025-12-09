/**
 * Packages
 */
const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const { orgDataPlugin } = require("../00_plugins/orgDataPlugin");

/**
 * Models
 */

const Schema = new mongoose.Schema(
  {
    clause: {
      type: String,
      required: true,
    },
    isLocked: {
      type: Boolean,
      default: true,
    },
    description: String,
    parentClause: String,
    kloe: {
      type: String,
    },
    childrenClauses: [],
    appliesTo: String,
  },
  { timestamps: true }
);

module.exports = (connection) => {
  Schema.plugin(orgDataPlugin)
  Schema.statics = {};
  mongoosePaginate(Schema);
  return mongoose.model("cqctools", Schema);
};
module.exports.Schema = Schema;
