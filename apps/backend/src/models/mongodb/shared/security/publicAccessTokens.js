/**
 * Packages
 */
const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const { orgDataPlugin } = require("../../system/00_plugins/orgDataPlugin");
/**
 * Models
 */

const Schema = new mongoose.Schema(
  {
    description: {
      type: String,
    },
    value: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

/**
 * Uses a connection to a mongodb database to create a reference to the model to be queried
 * @param {import("mongoose").Connection} connection - The connection to be used based on the tenant
 * @return {import("mongoose").Model} - The public access token model
 */
module.exports = (connection) => {
  Schema.plugin(orgDataPlugin);
  mongoosePaginate(Schema);
  return mongoose.model("publicaccesstokens", Schema);
};
