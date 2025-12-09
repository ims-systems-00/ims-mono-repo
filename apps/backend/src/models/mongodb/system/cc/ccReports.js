/**
 * Packages
 */
const mongoosePaginate = require("mongoose-paginate-v2");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate-v2");
const mongoose = require("mongoose");
const { orgDataPlugin } = require("../00_plugins/orgDataPlugin");
const { CC_ALLOWED_NET_ZERO_REPORTING_YEARS } = require("./ccEnum");

/**
 * Models
 */

const Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      // enum: [],
      default: null,
    },
    year: {
      type: Number,
      enum: CC_ALLOWED_NET_ZERO_REPORTING_YEARS,
      default: -1,
    },
    content: {
      type: Object,
      default: null,
    },
    status: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = () => {
  Schema.plugin(mongooseAggregatePaginate);
  Schema.plugin(mongoosePaginate);
  Schema.plugin(orgDataPlugin);
  return mongoose.model("ccreports", Schema);
};
module.exports.Schema = Schema;
