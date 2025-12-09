const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const { orgDataPlugin } = require("../00_plugins/orgDataPlugin");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate-v2");

const Schema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = (connection) => {
  Schema.plugin(mongoosePaginate);
  Schema.plugin(mongooseAggregatePaginate);
  Schema.plugin(orgDataPlugin);
  mongoosePaginate(Schema);

  return mongoose.model("txnEmails", Schema);
};
module.exports.Schema = Schema;
