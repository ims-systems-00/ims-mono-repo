/**
 * Packages
 */
const mongoosePaginate = require("mongoose-paginate-v2");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate-v2");
const mongoose = require("mongoose");
/**
 * Models
 */
const { factorSchema } = require("./schemaTemplates/factorSchema");
const factorManager = require("./plugins/factorManager");

const Schema = new mongoose.Schema(
  {
    ...factorSchema,
  },
  { timestamps: true }
);

module.exports = () => {
  Schema.plugin(mongooseAggregatePaginate);
  Schema.plugin(mongoosePaginate);
  Schema.plugin(factorManager);
  return mongoose.model("ccfactors", Schema);
};
module.exports.Schema = Schema;
