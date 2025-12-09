/**
 * Packages
 */
const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
/**
 * Models
 */

const BookingSchema = mongoose.Schema(
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
    additionalInformation: {
      type: String,
    },
    bookedDate: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

exports.Bookings = (connection) => mongoose.model("bookings", BookingSchema);

const ClosedDates = mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
});

exports.ClosedDates = (connection) =>
  mongoose.model("closeddates", ClosedDates);
