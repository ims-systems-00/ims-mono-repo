/**
 * Packages
 */
const mongoose = require("mongoose");
const autoIncreament = require("@riadhossain43/mongoose-autoincrement");
const mongoosePaginate = require("mongoose-paginate-v2");
/**
 * Models
 */
const User = require("../users&auth/user");

const Schema = new mongoose.Schema(
  {
    user: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        unique: true,
      },
    ],
    userDefined: [
      {
        name: String,
        label: String,
        type: String,
        value: Object,
      },
    ],
    default: [
      {
        name: String,
        label: String,
        type: String,
        value: Object,
      },
    ],
    reviewDate: Date,
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
  Schema.plugin(autoIncreament.plugin, { model: "walletunits", field: "ID" });
  Schema.pre("validate", async function (next) {
    this.reference = `PDP-${this.ID}`;
    next();
  });
  Schema.statics = {
    populateWalletUnit: function (unit) {
      return unit
        .populate([
          { path: "user", model: User(connection), select: "name email" },
          {
            path: "lineManager",
            model: User(connection),
            select: "name email",
          },
        ])
         ;
    },
  };
  mongoosePaginate(Schema);
  return mongoose.model("walletunits", Schema);
};
module.exports.Schema = Schema;
