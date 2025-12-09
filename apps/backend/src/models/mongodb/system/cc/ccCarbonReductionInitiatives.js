/**
 * Packages
 */
const mongoosePaginate = require("mongoose-paginate-v2");
const autoIncreament = require("@riadhossain43/mongoose-autoincrement");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate-v2");
const {
  softDeletePlugin,
} = require("@ims-systems-00/ims-core/lib/plugins/mongoose/softDelete");
const mongoose = require("mongoose");
/**
 * Models
 */
const { orgDataPlugin } = require("../00_plugins/orgDataPlugin");
const {
  statusController,
} = require("../00_plugins/ccReductionPlanStatusController");
const { attachment } = require("../../schemaTemplates/attachment");
const Schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    implementedAt: {
      type: Date,
      default: null,
    },
    identifiedAt: {
      type: Date,
      default: Date.now(),
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    assignedTo: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
    ],
    potentialCoBenefits: {
      type: String,
      default: "",
    },
    potentialUnintendedConsequences: {
      type: String,
      default: "",
    },
    attachments: [attachment],
    reference: {
      default: "",
      type: String,
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      default: "Medium",
    },
  },
  { timestamps: true }
);
// assignment , attachment not allowed to update
module.exports = (connection) => {
  autoIncreament.initialize(connection);
  Schema.plugin(autoIncreament.plugin, {
    model: "cccarbonreductioninitiatives",
    field: "ID",
  });
  Schema.plugin(orgDataPlugin);
  Schema.plugin(statusController);
  Schema.plugin(mongooseAggregatePaginate);
  Schema.plugin(softDeletePlugin);
  Schema.pre("validate", async function (next) {
    this.reference = `RPI-${this.ID}`;
    next();
  });
  Schema.pre("validate", async function (next) {
    if (this.implementedAt && this.implementedAt < new Date()) {
      this.identifiedAt = this.implementedAt;
    }
    next();
  });

  mongoosePaginate(Schema);
  return mongoose.model("cccarbonreductioninitiatives", Schema);
};
module.exports.Schema = Schema;
