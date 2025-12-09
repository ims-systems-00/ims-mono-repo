/**
 * Packages
 */
const mongoose = require("mongoose");
/**
 * Models
 */

const GetStartedSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    jobTitle: {
      type: String,
      required: true,
    },
    organisationName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
    },
    service: {
      type: String,
      required: true,
    },
    additionalInformation: {
      type: String,
    },
    bookedDate: {
      type: Date,
      default: Date.now,
    },
    iso27001: {
      type: Boolean,
      default: false,
    },
    iso20000: {
      type: Boolean,
      default: false,
    },
    iso27002: {
      type: Boolean,
      default: false,
    },
    iso45001: {
      type: Boolean,
      default: false,
    },
    iso14001: {
      type: Boolean,
      default: false,
    },
    iso9001: {
      type: Boolean,
      default: false,
    },
    iso22301: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = (connection) =>
  mongoose.model("getStarted", GetStartedSchema);
