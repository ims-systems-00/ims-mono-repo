/**
 * Packages
 */
const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const { moduleTypes } = require("../../schemaTemplates/utils/moduleTypes");
const { orgDataPlugin } = require("../00_plugins/orgDataPlugin");
/**
 * Models
 */
const Schema = new mongoose.Schema(
  {
    applicableModules: [
      {
        type: String,
        enum: [
          moduleTypes.hardwareassets,
          moduleTypes.softwareassets,
          moduleTypes.peopleassets,
          moduleTypes.premiseassets,
          moduleTypes.informationassets,
          moduleTypes.risks,
          moduleTypes.cips,
          moduleTypes.suppliers,
          moduleTypes.incidents,
          moduleTypes.expensereports,
          moduleTypes.customers,
        ],
        default: [],
      },
    ],
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    created: {
      by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
      on: {
        type: Date,
        default: Date.now,
      },
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
  mongoosePaginate(Schema);
  Schema.plugin(orgDataPlugin);
  return mongoose.model("tagsAndCategories", Schema);
};
module.exports.Schema = Schema;
