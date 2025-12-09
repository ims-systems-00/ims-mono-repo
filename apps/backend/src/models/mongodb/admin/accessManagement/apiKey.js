/**
 * Packages
 */
const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
/**
 * Models
 */

const TenantSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
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
  mongoosePaginate(TenantSchema);
  return mongoose.model("apikeys", TenantSchema);
};
