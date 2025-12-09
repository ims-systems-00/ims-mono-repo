/**
 * Packages
 */
const mongoose = require("mongoose");
const autoIncreament = require("@riadhossain43/mongoose-autoincrement");
const mongoosePaginate = require("mongoose-paginate-v2");
/**
 * Models
 */
const Customer = require("./customer");
const { orgDataPlugin } = require("../00_plugins/orgDataPlugin");
const UserModel = require("../users&auth/user");
const {
  organizationRef,
} = require("../../schemaTemplates/references/organization.ref");

const Schema = new mongoose.Schema(
  {
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "groups",
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "customers",
    },
    accountManager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    due: Date,
    emails: [
      {
        name: String,
        email: String,
      },
    ],
    entries: [
      {
        item: String,
        unitPrice: Number,
        units: Number,
        vatRate: Number,
        vatFigure: Number,
        subTotal: Number,
      },
    ],
    calculations: {
      total: Number,
      vatFigure: Number,
      discount: Number,
    },
    status: {
      type: String,
      enum: ["Draft", "Sent", "Paid"],
      default: "Draft",
    },
    created: {
      by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
      on: Date,
    },
    updated: {
      by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
      on: Date,
    },
    reference: {
      default: "",
      type: String,
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
  autoIncreament.initialize(connection);
  Schema.plugin(autoIncreament.plugin, { model: "invoices", field: "ID" });
  Schema.plugin(orgDataPlugin);
  Schema.pre("validate", async function (next) {
    this.reference = `INV-${this.ID}`;
    next();
  });
  Schema.statics.populateInvoice = function (user) {
      return user
        .populate([
          { path: "customer", model: Customer(connection) },
          {
            path: "created.by",
            model: UserModel(connection),
            select: "name profileImageSrc",
          },
          {
            path: "accountManager",
            model: UserModel(connection),
            select: "name email profileImageSrc",
          },
          {
            path: "updated.by",
            model: UserModel(connection),
            select: "name profileImageSrc",
          },
        ])
         ;
    },
  mongoosePaginate(Schema);
  return mongoose.model("invoices", Schema);
};
module.exports.Schema = Schema;
