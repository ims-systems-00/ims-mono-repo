const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const {
  softDeletePlugin,
} = require("@ims-systems-00/ims-core/lib/plugins/mongoose/softDelete");
const { orgDataPlugin } = require("../00_plugins/orgDataPlugin");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate-v2");

const calculateTotalPricePluin = (schema) => {
  schema.add({
    total: {
      type: Number,
      default: 0,
    },
  });
  schema.pre("validate", function (next) {
    this.total = this.unitPrice * this.quantity;
    next();
  });
};

const Schema = new mongoose.Schema(
  {
    imsProjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "imsProjects",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    unitPrice: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      default: 1,
    },
    description: {
      type: String,
      default: "",
    },
    currency: {
      type: String,
      default: "GBP",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
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
  Schema.plugin(softDeletePlugin);
  Schema.plugin(mongoosePaginate);
  Schema.plugin(mongooseAggregatePaginate);
  Schema.plugin(orgDataPlugin);
  Schema.plugin(calculateTotalPricePluin);
  mongoosePaginate(Schema);
  return mongoose.model("imsProjectBudget", Schema);
};
module.exports.Schema = Schema;
