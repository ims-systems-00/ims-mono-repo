const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const {
  softDeletePlugin,
} = require("@ims-systems-00/ims-core/lib/plugins/mongoose/softDelete");
const { orgDataPlugin } = require("../00_plugins/orgDataPlugin");
const {
  IMS_FORM_ELEMENTS_TYPE,
} = require("../../schemaTemplates/references/typesAndEnums");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate-v2");

const Schema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  attributes: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  validation: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  formId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "imsForms",
    default: null,
  },
  children: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "imsFormElements",
    },
  ],
  parentFormElement: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "imsFormElements",
  },

  nextFormElement: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "imsFormElements",
  },
  headElement: {
    type: Boolean,
  },
  previousFormElement: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "imsFormElements",
  },
});
/**
 * Uses a connection to a mongodb database to create a reference to the model to be queried
 * @param {import("mongoose").Connection} connection - The connection to be used based on the tenant
 * @return {import("mongoose").Model} - The worklog model
 */
module.exports = (connection) => {
  Schema.plugin(softDeletePlugin);
  Schema.plugin(mongoosePaginate);
  Schema.plugin(mongooseAggregatePaginate);
  Schema.plugin(orgDataPlugin);
  mongoosePaginate(Schema);
  return mongoose.model("imsFormElements", Schema);
};
module.exports.Schema = Schema;
