/**
 * Packages
 */
const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const { formFieldTypes } = require("../../schemaTemplates/utils");
const { orgDataPlugin } = require("../00_plugins/orgDataPlugin");
/**
 * Models
 */
const Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    relatedTagsAndCategories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "tagsAndCategories",
        default: null,
      },
    ],
    fields: [
      {
        type: {
          type: String,
          enum: [...Object.values(formFieldTypes)],
          required: true,
        },
        label: {
          type: String,
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        placeholder: String,
        helperText: String,
        options: [
          {
            label: String,
            value: mongoose.Schema.Types.Mixed,
          },
        ],
      },
    ],
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
  return mongoose.model("customForms", Schema);
};
module.exports.Schema = Schema;
